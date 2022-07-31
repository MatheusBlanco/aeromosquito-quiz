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
import { db, auth, logout } from '../firebase';
import { MainWindow } from '../components/MainWindow';
import Button from '../components/Button';
import TextInput from '../components/TextInput';

function CreateMatch({ history }) {
  const [matches, setmatches] = useState();
  const [matchCode, setMatchCode] = useState('');
  const [matchCodeError, setMatchCodeError] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const createMatch = async () => {
    const questions = await query(collection(db, 'questions'));

    const querySnapshot = await getDocs(questions);
    const questionLength = querySnapshot.size;
    const matchCodeId = uuidv4().substring(0, 6).toUpperCase();
    const match = collection(db, 'match');
    await addDoc(match, {
      id: uuidv4(),
      cod: matchCodeId,
      groups: [],
      currentQuestion: 1,
      questionLength,
    });
    history?.push(`/quiz/${matchCodeId}`);
    navigate(`/quiz/${matchCodeId}`);
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
    const validationError = validateMatchCode(match);
    if (validationError === undefined) {
      setMatchCodeError(true);
    } else {
      setMatchCodeError(false);
      history?.push(`/quiz/${match}`);
      navigate(`/quiz/${match}`);
    }
  };

  return (
    <MainWindow style={{ display: 'flex', flexDirection: 'column' }}>
      <Button
        onClick={() => {
          createMatch();
        }}
      >
        Criar partida
      </Button>

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
      <Button
        style={{ marginTop: 20 }}
        onClick={() => connectToExistingMatch(matchCode)}
      >
        Conectar com partida
      </Button>
      <Button
        onClick={() => {
          handleLogout();
        }}
      >
        Desconectar
      </Button>
      {user ? (
        <Button onClick={() => navigate('/newQuestions')}>
          Página de criação de perguntas
        </Button>
      ) : null}
    </MainWindow>
  );
}

export default CreateMatch;
