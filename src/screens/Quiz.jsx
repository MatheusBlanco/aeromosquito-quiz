/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import '../App.css';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import { StyledHeader } from '../components/Texts';

function Quiz({ history }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [match, setMatch] = useState(null);
  const navigate = useNavigate();

  const handleMatchInfo = async () => {
    const m = query(
      collection(db, 'match'),
      where('cod', '==', window.location.href.split('/')[4])
    );

    onSnapshot(m, (querySnapshot) => {
      setMatch(querySnapshot.docs.map((d) => d.data())[0]);
      setCurrentQuestion(
        querySnapshot.docs.map((d) => d.data())[0].currentQuestion
      );
    });
  };

  const logout = () => {
    localStorage.removeItem('group');
    history?.push('/');
    navigate('/');
  };

  const handleQuestions = async () => {
    const q = query(collection(db, 'questions'));
    onSnapshot(q, async (querySnapshot) => {
      setQuestions(querySnapshot.docs.map((d) => d.data()));
    });
  };

  useEffect(() => {
    handleMatchInfo();
    handleQuestions();
  }, []);

  return (
    <MainWindow>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <StyledHeader>{match?.cod}</StyledHeader>
        <ul>
          {match?.groups.map((group) => (
            <li key={group?.groupId}>
              {group?.groupName} - {group?.score} pontos
            </li>
          ))}
        </ul>
        <QuestionSection>
          {currentQuestion <= questions?.length ? (
            <>
              <QuestionCount>
                <StyledHeader>Question {currentQuestion}</StyledHeader>/
                {questions?.length}
              </QuestionCount>
              <CurrentQuestion>
                {questions[currentQuestion - 1]?.questionText}
              </CurrentQuestion>
            </>
          ) : null}
        </QuestionSection>
        <Button
          style={{ width: '10%', alignSelf: 'center', marginTop: 20 }}
          onClick={() => {
            logout();
          }}
          child="Sair"
        />
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

export default Quiz;
