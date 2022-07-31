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
    } else if (correct === false) {
      currentgroup.questionsAnswered += 1;
    }

    await updateDoc(documentRef, 'groups', arrayUnion(currentgroup));
  };

  const handleAnswerOptionClick = async (isCorrect) => {
    const m = query(
      collection(db, 'match'),
      where('cod', '==', window.location.href.split('/')[5])
    );
    const querySnapshot = await getDocs(m);
    if (isCorrect) {
      setScore(score + 1);
      setMessage('O miserável é um gênio. Espera a outra pessoa');
      const g = doc(db, 'group', `${token}`);
      await updateDoc(g, { score: score + 1 });

      querySnapshot.forEach((document) => {
        updateDocuments(document, true);
      });
    } else {
      setMessage('O miserável NÃO é um gênio. Espera a outra pessoa');
      querySnapshot.forEach((document) => {
        updateDocuments(document, false);
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
      {/* {showScore ? (
        <>
          <ScoreSection>
            You scored {score} out of {questions.length}
          </ScoreSection>
          <Button
            onClick={() => {
              logout();
            }}
          >
            Quitar
          </Button>
        </>
      ) : questions.length ? ( */}
      <div>
        <StyledHeader>{match?.cod}</StyledHeader>

        <QuestionSection>
          <Button
            onClick={() => {
              logout();
            }}
          >
            Quitar
          </Button>
          {currentQuestion < questions.length ? (
            <div>
              <QuestionCount>
                <StyledHeader>Question {currentQuestion + 1}</StyledHeader>/
                {questions.length}
              </QuestionCount>
              <CurrentQuestion>
                {questions[currentQuestion].questionText}
              </CurrentQuestion>
              <AnswerSection>
                {questions[currentQuestion].answerOptions?.map(
                  (answer, index) => (
                    <Button
                      key={index}
                      type="button"
                      onClick={() => handleAnswerOptionClick(answer.isCorrect)}
                    >
                      {answer.answerText}
                    </Button>
                  )
                )}
              </AnswerSection>
              <p>{message}</p>
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
