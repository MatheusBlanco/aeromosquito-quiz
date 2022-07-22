/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React from 'react';
import { collection, addDoc, query, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../firebase';
import { MainWindow } from '../components/MainWindow';
import Button from '../components/Button';

function CreateMatch({ history }) {
  const createMatch = async () => {
    const questions = await query(collection(db, 'questions'));

    const querySnapshot = await getDocs(questions);
    const questionLength = querySnapshot.size;
    const matchCode = uuidv4().substring(0, 6).toUpperCase();
    const match = collection(db, 'match');
    await addDoc(match, {
      id: uuidv4(),
      cod: matchCode,
      groups: [],
      canProceed: false,
      currentQuestion: 1,
      questionLength,
    });
    history?.push(`/quiz/${matchCode}`);
    window.location.assign(`/quiz/${matchCode}`);
  };

  const logout = () => {
    localStorage.removeItem('group');
    history?.push('/');
    window.location.assign('/');
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

      <Button
        onClick={() => {
          logout();
        }}
      >
        Voltar à pagina inicial
      </Button>
    </MainWindow>
  );
}

export default CreateMatch;
