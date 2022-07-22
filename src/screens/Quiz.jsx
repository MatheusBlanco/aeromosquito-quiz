/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  collection,
  doc,
  query,
  onSnapshot,
  where,
  updateDoc,
} from 'firebase/firestore';
import styled from 'styled-components';
import { db } from '../firebase';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import { StyledHeader } from '../components/Texts';

function Quiz({ history }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [match, setMatch] = useState(null);

  const token = localStorage.getItem('group');

  const handleMatchInfo = async () => {
    const m = query(
      collection(db, 'match'),
      where('cod', '==', window.location.href.split('/')[4])
    );

    onSnapshot(m, (querySnapshot) => {
      setMatch(querySnapshot.docs.map((d) => d.data())[0]);
    });
  };

  const logout = () => {
    localStorage.removeItem('group');
    history?.push('/');
    window.location.assign('/');
  };

  useEffect(() => {
    // handleGroups();
    handleMatchInfo();
    const q = query(collection(db, 'questions'));
    onSnapshot(q, (querySnapshot) => {
      setQuestions(querySnapshot.docs.map((d) => d.data()));
    });
  }, []);

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
          <StyledHeader>{match?.cod}</StyledHeader>
          <ul>
            {match?.groups.map((group) => (
              <li>
                {group.groupName} - {group.score} pontos
              </li>
            ))}
          </ul>
          <QuestionSection>
            <Button
              onClick={() => {
                logout();
              }}
            >
              Quitar
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
                    disabled
                    onClick={() => handleAnswerOptionClick(answer.isCorrect)}
                  >
                    {answer.answerText}
                  </Button>
                )
              )}
            </AnswerSection>
          </QuestionSection>
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
