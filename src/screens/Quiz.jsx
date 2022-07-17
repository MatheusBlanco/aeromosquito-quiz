/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  collection,
  doc,
  query,
  onSnapshot,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import styled from 'styled-components';
import { db } from '../firebase';
import Button from '../components/styles/Button';
import { MainWindow } from '../components/styles/MainWindow';
import { StyledHeader } from '../components/styles/Texts';

function Quiz({ history }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(null);

  const token = localStorage.getItem('group');

  const logout = () => {
    localStorage.removeItem('group');
    history?.push('/');
    window.location.assign('/');
  };

  useEffect(() => {
    if (!token) {
      history?.push('/');
      window.location.assign('/');
    }
    const q = query(collection(db, 'questions'));
    onSnapshot(q, (querySnapshot) => {
      setQuestions(querySnapshot.docs.map((d) => d.data()));
    });
  }, []);

  const handleDoc = async () => {
    const gs = doc(db, 'group', token);

    const docSnap = await getDoc(gs);

    if (docSnap.exists()) {
      setCurrentScore(docSnap.data().score);
    }
  };

  useEffect(() => {
    handleDoc();
  }, [currentQuestion, showScore]);

  const handleAnswerOptionClick = async (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
      const group = doc(db, 'group', `${token}`);
      await updateDoc(group, { score: score + 1 });
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  // const handleCreateData = () => {
  //   questionsAndAnswers.forEach((entry) => {
  //     const questionsToAdd = collection(db, 'questions');
  //     return addDoc(questionsToAdd, {
  //       questionText: entry.questionText,
  //       answerOptions: entry.answerOptions,
  //     });
  //   });
  // };

  return (
    <MainWindow>
      {showScore ? (
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
      ) : questions.length ? (
        <div>
          <QuestionSection>
            <Button
              onClick={() => {
                logout();
              }}
            >
              {currentScore}
            </Button>
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
          </QuestionSection>

          {/* <button type="button" onClick={() => handleCreateData()}>
            create
          </button> */}
        </div>
      ) : null}
    </MainWindow>
  );
}

const ScoreSection = styled.div`
  display: flex;
  font-size: 24px;
  align-items: center;
`;

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

export default Quiz;
