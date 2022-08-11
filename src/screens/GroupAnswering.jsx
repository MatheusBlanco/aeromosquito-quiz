/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
import React, { useState, useEffect } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
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
import { db } from '../firebase';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import { StyledHeader } from '../components/Texts';

function GroupAnswering({ history }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('group');

  const handleMatchInfo = async () => {
    const m = query(
      collection(db, 'match'),
      where('cod', '==', window.location.href.split('/')[5])
    );

    onSnapshot(m, (qs) => {
      setMatch(qs.docs.map((d) => d.data())[0]);
      return qs.docs.map((d) => d.data())[0];
    });
  };

  const logout = () => {
    localStorage.removeItem('group');
    history?.push('/');
    navigate('/');
  };

  useEffect(() => {
    handleMatchInfo();
    const q = query(collection(db, 'questions'));

    onSnapshot(q, (querySnapshot) => {
      setQuestions(querySnapshot.docs.map((d) => d.data()));
    });
  }, []);

  const updateDocuments = async (document, correct) => {
    const documentRef = doc(db, 'match', document.id);
    const currentgroup = document
      .data()
      .groups.find((g) => g.groupId === token);

    await updateDoc(documentRef, 'groups', arrayRemove(currentgroup));

    if (correct === true) {
      currentgroup.score += 1;
      currentgroup.questionsAnswered += 1;
    } else {
      currentgroup.questionsAnswered += 1;
    }

    await updateDoc(documentRef, 'groups', arrayUnion(currentgroup));
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
        setMessage('Parabéns!');
        setLoading(false);
      });
    } else {
      querySnapshot.forEach(async (document) => {
        await updateDocuments(document, false);
        setMessage('Uma pena... Fique de olho para a próxima pergunta!');
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

          setCurrentQuestion(matchCurrentQuestion - 1);
          setMessage(null);
        }
      });
    });
  };

  return (
    <MainWindow>
      <div>
        <StyledHeader>{match?.cod}</StyledHeader>

        <QuestionSection>
          {currentQuestion < questions.length ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <QuestionCount>
                <StyledHeader>Question {currentQuestion + 1}</StyledHeader>/
                {questions.length}
              </QuestionCount>
              <CurrentQuestion>
                {questions[currentQuestion].questionText}
              </CurrentQuestion>
              <AnswerSection>
                {!message ? (
                  questions[currentQuestion].answerOptions?.map(
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
                  <p>{message}</p>
                ) : (
                  <p>Cadastrando resposta...</p>
                )}
              </AnswerSection>
            </div>
          ) : null}
        </QuestionSection>
      </div>
      {/* ) : null} */}
    </MainWindow>
  );
}

// const ScoreSection = styled.div`
//   display: flex;
//   font-size: 24px;
//   align-items: center;

// `;

const QuestionSection = styled.div`
  width: 100%;
  position: relative;
`;

const QuestionCount = styled.div`
  margin-bottom: 20px;
`;

const CurrentQuestion = styled.div`
  margin-bottom: 12px;
`;

const AnswerSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default GroupAnswering;
