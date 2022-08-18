/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import '../App.css';
import {
  collection,
  query,
  onSnapshot,
  where,
  doc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
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
    onSnapshot(m, async (querySnapshot) => {
      setMatch(querySnapshot.docs.map((d) => d.data())[0]);
      const q = await query(
        collection(db, 'questions'),
        where(
          'id',
          'in',
          querySnapshot.docs.map((d) => d.data())[0]?.questionsArray
        )
      );
      onSnapshot(q, async (qS) => {
        setQuestions(qS.docs.map((d) => d.data()));
      });

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

  const updateWithAnswerer = async (id, name) => {
    const m = query(collection(db, 'match'), where('cod', '==', match.cod));
    const querySnapshot = await getDocs(m);
    querySnapshot.forEach(async (document) => {
      const documentRef = doc(db, 'match', document.id);
      await updateDoc(documentRef, 'currentAnswerer', { id, name });
    });
  };

  useEffect(() => {
    handleMatchInfo();
  }, []);

  return (
    <MainWindow>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <StyledHeader>{match?.cod}</StyledHeader>
        <ul>
          {match?.groups.map((group) => (
            <li key={group?.groupId}>
              <span style={{ fontSize: 20, fontWeight: 'bold' }}>
                {group?.groupName} - {group?.score} pontos
              </span>
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
              {!match?.currentAnswerer || match?.currentAnswerer === null ? (
                <>
                  <span>- Escolha o grupo que poderá responder à pergunta</span>
                  {match?.groups.map((group) => (
                    <Button
                      style={{ marginTop: '1vh' }}
                      onClick={() =>
                        updateWithAnswerer(group.groupId, group.groupName)
                      }
                      child={group?.groupName}
                    />
                  ))}
                </>
              ) : (
                <span style={{ fontWeight: 'bold' }}>
                  O time {match.currentAnswerer.name} pode responder à pergunta
                </span>
              )}
            </>
          ) : null}
        </QuestionSection>
        <Button
          style={{ minWidth: '10%', alignSelf: 'center', marginTop: 20 }}
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

const QuestionSection = styled.div`
  width: 100%;
  position: relative;
`;

const QuestionCount = styled.div`
  margin-bottom: 20px;
`;

const CurrentQuestion = styled.div`
  margin-bottom: 12px;
  font-weight: bold;
  font-size: 2.5vh;
`;

export default Quiz;
