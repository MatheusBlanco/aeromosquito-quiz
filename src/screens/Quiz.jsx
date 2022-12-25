/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-nested-ternary */
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import styled from 'styled-components';
import '../App.css';
import Thanks from '../assets/images/Obrigado.jpg';
import Button from '../components/Button';
import { GOBackButton } from '../components/GoBackButton';
import GroupPoints from '../components/GroupPoints';
import { MainWindow } from '../components/MainWindow';
import { StyledHeader } from '../components/Texts';
import { db } from '../firebase';
import useWindowDimensions from '../hooks/useWindowsDimensions';

function Quiz({ history }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [match, setMatch] = useState(null);
  const navigate = useNavigate();
  const { width } = useWindowDimensions();

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
    history?.push('/dash');
    navigate('/dash');
  };

  const updateWithAnswerer = async (id, name) => {
    const m = query(collection(db, 'match'), where('cod', '==', match.cod));
    const querySnapshot = await getDocs(m);
    querySnapshot.forEach(async (document) => {
      const documentRef = doc(db, 'match', document.id);
      await updateDoc(documentRef, 'currentAnswerer', {
        id,
        name,
        lastAnswererId: null,
        lastAnswererName: null,
      });
    });
  };

  useEffect(() => {
    handleMatchInfo();
  }, []);

  return (
    <MainWindow>
      <div
        style={{
          display: 'flex',
          flexDirection: width <= 500 ? 'column-reverse' : 'row',
          alignContent: 'flex-start',
          gap: '20px',
        }}
      >
        <QuestionSection>
          <GOBackButton
            onClickFunc={() => {
              logout();
            }}
          />
          {currentQuestion <= questions?.length ? (
            <>
              <QuestionCount>
                <StyledHeader>Questão {currentQuestion}</StyledHeader>/
                {questions?.length}
              </QuestionCount>
              <CurrentQuestion>
                {questions[currentQuestion - 1]?.questionText}
              </CurrentQuestion>
              {!match?.currentAnswerer || match?.currentAnswerer === null ? (
                <>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    Escolha o grupo que poderá responder à pergunta{' '}
                    <StyledButton>
                      <AiOutlineQuestionCircle id="my-anchor-element" />
                    </StyledButton>
                  </span>{' '}
                  <Tooltip
                    anchorId="my-anchor-element"
                    content="Realize uma dinâmica, como par ou ímpar, para escolher o primeiro grupo a responder à pergunta"
                    place="top"
                  />
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
          ) : (
            <img style={{ width: '30vw', minWidth: 200 }} src={Thanks} alt="" />
          )}{' '}
        </QuestionSection>{' '}
        <div className="divider" />
        <GroupPoints match={match} />
      </div>
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
  max-width: 300px;
  display: block;
`;

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--white);
  background-color: var(--dark-green);
  border-radius: 30px;
  padding: 2px;
  border: 2px solid var(--dark-green);
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Quiz;
