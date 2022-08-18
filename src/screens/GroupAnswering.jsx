/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  collection,
  doc,
  query,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  getDocs,
  where,
  updateDoc,
} from 'firebase/firestore';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import { StyledHeader } from '../components/Texts';
import Correct from '../assets/images/Acerto.jpg';
import Wrong from '../assets/images/Erro.jpg';
import Tied from '../assets/images/Empate.jpg';

function GroupAnswering({ history }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('group');

  const leaveMatch = () => {
    localStorage.removeItem('group');
    history?.push('/quiz/group');
    navigate('/quiz/group');
  };

  const handleMatchInfo = async () => {
    const m = query(
      collection(db, 'match'),
      where('cod', '==', window.location.href.split('/')[5])
    );

    onSnapshot(m, async (qs) => {
      setMatch(qs.docs.map((d) => d.data())[0]);
      setCurrentQuestion(qs.docs.map((mat) => mat.data())[0].currentQuestion);
      const q = await query(
        collection(db, 'questions'),
        where('id', 'in', qs.docs.map((d) => d.data())[0]?.questionsArray)
      );
      onSnapshot(q, async (qS) => {
        setQuestions(qS.docs.map((d) => d.data()));
      });
      return qs.docs.map((d) => d.data())[0];
    });
  };

  useEffect(() => {
    handleMatchInfo();
  }, []);

  const updateDocuments = async (document, correct) => {
    const documentRef = doc(db, 'match', document.id);
    const currentgroup = document
      .data()
      .groups.find((g) => g.groupId === token);

    const foeGroup = document
      .data()
      .groups.find((group) => group.groupId !== token);

    await updateDoc(documentRef, 'groups', arrayRemove(currentgroup));
    await updateDoc(documentRef, 'groups', arrayRemove(foeGroup));

    if (correct === true) {
      currentgroup.score += 1;
      currentgroup.questionsAnswered += 1;
      foeGroup.questionsAnswered += 1;
      await updateDoc(documentRef, 'currentAnswerer', null);
    } else {
      if (document?.data()?.currentAnswerer?.lastAnswererId === null) {
        await updateDoc(documentRef, 'currentAnswerer', {
          id: foeGroup?.groupId,
          name: foeGroup?.groupName,
          lastAnswererId: currentgroup?.groupId,
          lastAnswererName: currentgroup?.groupName,
        });
      } else {
        await updateDoc(documentRef, 'currentAnswerer', null);
        currentgroup.questionsAnswered += 1;
        foeGroup.questionsAnswered += 1;
      }
    }

    await updateDoc(documentRef, 'groups', arrayUnion(currentgroup));
    await updateDoc(documentRef, 'groups', arrayUnion(foeGroup));
  };

  const handleAnswerOptionClick = async (isCorrect) => {
    setLoading(true);
    const m = query(
      collection(db, 'match'),
      where('cod', '==', window.location.href.split('/')[5])
    );
    const querySnapshot = await getDocs(m);
    if (isCorrect) {
      const g = doc(db, 'group', `${token}`);
      await updateDoc(g, { score: score + 1 });

      querySnapshot.forEach(async (document) => {
        await updateDocuments(document, true);
        setScore(score + 1);
        setMessage('acerto');
        setLoading(false);
      });
    } else {
      querySnapshot.forEach(async (document) => {
        await updateDocuments(document, false);

        setMessage('erro');
        setLoading(false);
      });
    }

    let matchCurrentQuestion;
    onSnapshot(m, (qs) => {
      qs.docs.forEach(async (d) => {
        if (
          d.data()?.groups[1]?.questionsAnswered ===
            d?.data()?.currentQuestion &&
          d.data()?.groups[0]?.questionsAnswered === d.data()?.currentQuestion
        ) {
          matchCurrentQuestion = d.data().currentQuestion += 1;
          const documentRef = doc(db, 'match', d.id);

          await updateDoc(documentRef, 'currentQuestion', matchCurrentQuestion);
          await updateDoc(documentRef, 'currentAnswerer', null);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        }
      });
    });
  };

  const answerMessage = () => {
    if (message === 'acerto') {
      return (
        <img style={{ width: '30vw', minWidth: 200 }} src={Correct} alt="" />
      );
    }
    if (message === 'erro') {
      return (
        <img style={{ width: '30vw', minWidth: 200 }} src={Wrong} alt="" />
      );
    }
    return null;
  };

  const endMessage = () => {
    if (
      match?.groups?.find((group) => group?.groupId === token)?.score >
      match?.groups?.find((group) => group?.groupId !== token)?.score
    ) {
      return (
        <img style={{ width: '30vw', minWidth: 200 }} src={Correct} alt="" />
      );
    }
    if (
      match?.groups?.find((group) => group?.groupId === token)?.score ===
      match?.groups?.find((group) => group?.groupId !== token)?.score
    ) {
      return <img style={{ width: '30vw', minWidth: 200 }} src={Tied} alt="" />;
    }
    return <img style={{ width: '30vw', minWidth: 200 }} src={Wrong} alt="" />;
  };

  return (
    <MainWindow>
      <div>
        <QuestionSection>
          {currentQuestion <= questions.length ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <QuestionCount>
                <StyledHeader>
                  {match?.groups?.find((g) => g?.groupId === token)?.groupName}
                </StyledHeader>
                <br />
                <StyledHeader>
                  Question {currentQuestion}/{questions.length}
                </StyledHeader>
              </QuestionCount>
              {match?.currentAnswerer?.id === token && !message ? (
                <AnswerSection>
                  {!message ? (
                    questions[currentQuestion - 1].answerOptions?.map(
                      (answer, index) => (
                        <Button
                          style={{
                            marginTop: 10,
                            width: '70%',
                            alignSelf: 'center',
                          }}
                          key={index}
                          type="button"
                          child={answer.answerText}
                          onClick={() =>
                            handleAnswerOptionClick(answer.isCorrect)
                          }
                        />
                      )
                    )
                  ) : !loading ? (
                    <p>{answerMessage()}</p>
                  ) : (
                    <p>Cadastrando resposta...</p>
                  )}
                </AnswerSection>
              ) : !message ? (
                <StyledHeader>
                  Espere o resultado da escolha de grupos
                </StyledHeader>
              ) : (
                <p>{answerMessage()}</p>
              )}
            </div>
          ) : (
            <div>
              <QuestionSection>
                <StyledHeader>Resultados: </StyledHeader>
                <AnswerSection>{endMessage()}</AnswerSection>
                <Button
                  style={{ marginTop: 20 }}
                  onClick={() => leaveMatch()}
                  child="Voltar"
                />
              </QuestionSection>
            </div>
          )}
        </QuestionSection>
      </div>
      {/* ) : null} */}
    </MainWindow>
  );
}

const QuestionSection = styled.div`
  width: 100%;
  position: relative;
`;

const QuestionCount = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

const AnswerSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default GroupAnswering;
