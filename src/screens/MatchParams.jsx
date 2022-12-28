/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import toast from 'react-hot-toast';
import Checkbox from '../components/CheckBox';
import { MainWindow } from '../components/MainWindow';
import TextInput from '../components/TextInput';
import { StyledHeader } from '../components/Texts';
import { db } from '../firebase';
import { StyledButton } from './Dashboard';

function MatchParams({ history }) {
  const [loading, setLoading] = useState(false);
  const [timeoutTime, setTimeoutTime] = useState();
  const [addTime, setAddTime] = useState(false);
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
      currentAnswerer: null,
      timeout: timeoutTime > 0 ? Number(timeoutTime) : null,
    })
      .then(() => {
        history?.push(`/quiz/${matchCodeId}`);
        navigate(`/quiz/${matchCodeId}`);
      })
      .catch(() =>
        toast.error(
          'Houve um erro no sistema ao tentar criar a partida, tente novamente mais tarde'
        )
      );
    setLoading(false);
  };

  return (
    <MainWindow>
      <div style={{ display: 'flex', flexDirection: 'column', padding: 15 }}>
        <StyledHeader>Defina os parâmetros para sua partida</StyledHeader>
        <StyledButton
          onClick={() => {
            setAddTime(true);
          }}
          child="Adicionar tempo de resposta"
        />
        {addTime && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 15,
              gap: '15px',
            }}
          >
            <Checkbox
              label="Tempo de resposta"
              value={addTime}
              onChange={() => setAddTime(!addTime)}
            />
            <TextInput
              label="Adicione o tempo de resposta da partida"
              tooltip
              type="number"
              value={timeoutTime}
              onTextChange={(value) => setTimeoutTime(value)}
              tooltipMessage="Em segundos"
            />
          </div>
        )}
        <StyledButton
          onClick={() => {
            createMatch();
          }}
          loading={loading}
          child="Gerar partida"
          style={{ height: '60px', fontSize: '30px' }}
        />
      </div>{' '}
    </MainWindow>
  );
}

export default MatchParams;
