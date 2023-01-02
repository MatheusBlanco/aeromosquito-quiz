/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import TextInput from '../components/TextInput';
import { StyledHeader } from '../components/Texts';
import { auth, db, logout } from '../firebase';

function Dashboard({ history }) {
  const [matches, setmatches] = useState();
  const [matchCode, setMatchCode] = useState('');
  const [matchCodeError, setMatchCodeError] = useState(false);
  const [connectLoad, setConnectLoad] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const createMatch = async () => {
    history?.push('/matchParams');
    navigate(`/matchParams`);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('group');
    history?.push('/');
    navigate('/');
    window.location.reload();
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
    <MainWindow
      color={
        localStorage.getItem('color') ? localStorage.getItem('color') : 'green'
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', padding: 15 }}>
        <StyledHeader>Painel de gerenciamento de organizador</StyledHeader>
        <br />
        <TextInput
          label="Inserir código da partida"
          value={matchCode}
          onTextChange={(value) => setMatchCode(value)}
          wrongData={matchCodeError}
          tooltip
          tooltipMessage="O código deve conter 6 caractéres"
          wrongDataMessage={
            matchCodeError ? 'Código inexistente. Insira um código válido' : ''
          }
          type="text"
        />
        {matchCode.length >= 6 ? (
          <StyledButton
            onClick={() => connectToExistingMatch(matchCode)}
            child="Conectar com partida"
            loading={connectLoad}
            style={{ backgroundColor: 'var(--secondary-green)' }}
          />
        ) : null}

        {user ? (
          <StyledButton
            onClick={() => navigate('/newQuestions')}
            child="Criação de perguntas"
            style={{ backgroundColor: 'var(--secondary-green)' }}
          />
        ) : null}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            align: 'center',
            gap: '20px',
          }}
        >
          <StyledButton
            onClick={() => {
              handleLogout();
            }}
            child="Desconectar"
            style={{
              backgroundColor: 'var(--dark-red)',
              border: '2px solid var(--dark-red)',
            }}
          />
          <StyledButton
            onClick={() => {
              createMatch();
            }}
            child="Criar partida"
          />
        </div>
      </div>
    </MainWindow>
  );
}
export const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  align-self: center;
`;

export default Dashboard;
