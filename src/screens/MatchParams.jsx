/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { v4 as uuidv4 } from 'uuid';

import toast from 'react-hot-toast';
import Checkbox from '../components/CheckBox';
import { MainWindow } from '../components/MainWindow';
import Select from '../components/Select';
import TextInput from '../components/TextInput';
import { StyledHeader } from '../components/Texts';
import { db } from '../firebase';
import { StyledButton } from './Dashboard';

function MatchParams({ history }) {
  const [loading, setLoading] = useState(false);
  const [timeoutTime, setTimeoutTime] = useState();
  const [addTime, setAddTime] = useState(false);
  const [customColor, setCustomColor] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const navigate = useNavigate();

  const generateArray = (questionLength) =>
    [...new Array(10)].map(() => Math.round(Math.random() * questionLength));

  const createMatch = async () => {
    setLoading(true);
    const questions = await query(
      collection(db, 'questions'),
      where('theme', '==', selectedTheme)
    );
    const querySnapshot = await getDocs(questions);
    const questionLength = querySnapshot.size;
    const foundQuestions = querySnapshot.docs.map((qu) => qu.data());

    const questionsArray = generateArray(questionLength);
    const quizQuestions = [];

    questionsArray.map((indexOfItem) =>
      quizQuestions.push(foundQuestions[indexOfItem])
    );

    const matchCodeId = uuidv4().substring(0, 6).toUpperCase();
    const match = collection(db, 'match');
    await addDoc(match, {
      id: uuidv4(),
      cod: matchCodeId,
      groups: [],
      currentQuestion: 1,
      questionLength: quizQuestions.length,
      questionsArray: quizQuestions.map((q) => q.id),
      currentAnswerer: null,
      timeout: timeoutTime > 0 ? Number(timeoutTime) : null,
      customColor: selectedColor || null,
      theme: selectedTheme,
    })
      .then(() => {
        history?.push(`/quiz/${matchCodeId}`);
        navigate(`/quiz/${matchCodeId}`);
        toast(
          `Partida do tema ${selectedTheme}
          criada com sucesso! Bom divertimento!`
        );
      })
      .catch(() =>
        toast.error(
          'Houve um erro no sistema ao tentar criar a partida, tente novamente mais tarde'
        )
      );
    setLoading(false);
  };

  const handleQuestionThemes = async () => {
    const q = await query(collection(db, 'questions'));
    onSnapshot(q, async (querySnapshot) => {
      const questions = querySnapshot.docs.map((quest) => quest.data());
      const groupedMap = questions.reduce(
        (entryMap, e) =>
          entryMap.set(e.theme, [...(entryMap.get(e.theme) || []), e]),
        new Map()
      );
      const themesArray = [];
      for (const [key, value] of groupedMap) {
        if (value.length >= 10) themesArray.push({ answer: key, id: key });
      }
      setThemes(themesArray);
    });
  };

  useEffect(() => {
    handleQuestionThemes();
  }, []);

  return (
    <MainWindow
      color={
        localStorage.getItem('color') ? localStorage.getItem('color') : 'green'
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', padding: 15 }}>
        <StyledHeader>Defina os parâmetros para sua partida</StyledHeader>
        {!addTime && (
          <StyledButton
            onClick={() => {
              setAddTime(true);
            }}
            child="Adicionar tempo de resposta"
          />
        )}
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
        )}{' '}
        {!customColor && (
          <StyledButton
            onClick={() => {
              setCustomColor(true);
            }}
            child="Escolher paleta de cores"
          />
        )}
        {customColor && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 15,
              gap: '15px',
            }}
          >
            <Checkbox
              label="Paleta de cor"
              value={customColor}
              onChange={() => setCustomColor(!customColor)}
            />
            <Select
              options={[
                { answer: 'Verde', id: 'green' },
                { answer: 'Azul', id: 'blue' },
                { answer: 'Vermelho', id: 'red' },
                { answer: 'Rosa', id: 'pink' },
                { answer: 'Amarelo', id: 'yellow' },
              ]}
              complex
              onOptionClick={(option) => setSelectedColor(option)}
              selectedOption
              defaultPlaceholder="Paleta de cor"
              selectstyle
              width
            />
          </div>
        )}
        <p>Escolha um tema para sua partida</p>
        <Select
          options={themes}
          complex
          onOptionClick={(option) => setSelectedTheme(option)}
          selectedOption
          defaultPlaceholder="Temas"
          selectstyle={{ marginTop: 20 }}
          width
        />
        <StyledButton
          onClick={() => {
            createMatch();
          }}
          disabled={selectedTheme === ''}
          loading={loading}
          child="Gerar partida"
          style={{ height: '60px', fontSize: '30px' }}
        />
      </div>{' '}
    </MainWindow>
  );
}

export default MatchParams;
