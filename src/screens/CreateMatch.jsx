/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { db, auth, logout } from '../firebase';
import { MainWindow } from '../components/MainWindow';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { StyledHeader } from '../components/Texts';

function CreateMatch({ history }) {
  const [matches, setmatches] = useState();
  const [matchCode, setMatchCode] = useState('');
  const [matchCodeError, setMatchCodeError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connectLoad, setConnectLoad] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const generateArray = (questionLength) =>
    [...new Array(10)].map(() => Math.round(Math.random() * questionLength));

  const createMatch = async () => {
    setLoading(true);
    const questions = await query(collection(db, 'questions'));
    const querySnapshot = await getDocs(questions);
    const questionLength = querySnapshot.size;

    const questionsArray = generateArray(questionLength);

    const matchCodeId = uuidv4().substring(0, 6).toUpperCase();
    const match = collection(db, 'match');
    await addDoc(match, {
      id: uuidv4(),
      cod: matchCodeId,
      groups: [],
      currentQuestion: 1,
      questionLength: questionsArray.length,
      questionsArray,
    });
    history?.push(`/quiz/${matchCodeId}`);
    navigate(`/quiz/${matchCodeId}`);
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('group');
    history?.push('/');
    navigate('/');
    if (user) logout();
  };

  const handleMatches = async () => {
    const m = query(collection(db, 'match'));
    onSnapshot(m, (querySnapshot) => {
      setmatches(querySnapshot.docs.map((d) => d.data()));
    });
  };

  useEffect(() => {
    handleMatches();
  }, []);

  const validateMatchCode = (code) =>
    matches.find((match) => {
      if (match.cod !== code.toUpperCase()) {
        return false;
      }
      return true;
    });

  const connectToExistingMatch = async (match) => {
    setConnectLoad(true);
    const validationError = validateMatchCode(match);
    if (validationError === undefined) {
      setMatchCodeError(true);
    } else {
      setMatchCodeError(false);
      history?.push(`/quiz/${match}`);
      navigate(`/quiz/${match}`);
    }
    setConnectLoad(false);
  };

  return (
    <MainWindow>
      <div style={{ display: 'flex', flexDirection: 'column', padding: 15 }}>
        <StyledHeader>Painel de gerenciamento de organizador</StyledHeader>
        <br />
        <TextInput
          label="Inserir código da partida"
          value={matchCode}
          onTextChange={(value) => setMatchCode(value)}
          wrongData={matchCodeError}
          wrongDataMessage={
            matchCodeError ? 'Código inexistente. Insira um código válido' : ''
          }
          type="text"
        />
        {matchCode.length >= 6 ? (
          <StyledButton
            style={{ marginTop: 20 }}
            onClick={() => connectToExistingMatch(matchCode)}
            child="Conectar com partida"
            loading={connectLoad}
          />
        ) : null}
        <StyledButton
          onClick={() => {
            createMatch();
          }}
          loading={loading}
          child="Criar partida"
        />
        {user ? (
          <StyledButton
            onClick={() => navigate('/newQuestions')}
            child="Criação de perguntas"
          />
        ) : null}
        <StyledButton
          onClick={() => {
            handleLogout();
          }}
          child="Desconectar"
        />
      </div>
    </MainWindow>
  );
}
const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 50%;
  align-self: center;
`;

export default CreateMatch;
