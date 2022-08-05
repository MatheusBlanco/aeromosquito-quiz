/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import { collection, onSnapshot, query, addDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import Modal from '../components/Modal';
import { StyledHeader } from '../components/Texts';
import { auth, db } from '../firebase';
import TextInput from '../components/TextInput';
import Select from '../components/Select';

function NewQuestions() {
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [modal, setModal] = useState(false);
  const [user] = useAuthState(auth);
  const [newQuestion, setNewQuestion] = useState('');
  const [modalState, setModalState] = useState('question');
  const [newQuestionList, setNewQuestionList] = useState([]);
  const [alternative1, setAlternative1] = useState('');
  const [alternative2, setAlternative2] = useState('');
  const [alternative3, setAlternative3] = useState('');
  const [alternative4, setAlternative4] = useState('');
  const [alternatives, setAlternatives] = useState([]);
  const [correctAlternative, setCorrectAlternative] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleExistingQuestions = async () => {
    const q = query(collection(db, 'questions'));

    onSnapshot(q, (querySnapshot) => {
      setExistingQuestions(querySnapshot.docs.map((d) => d.data()));
    });
  };

  useEffect(() => {
    if (!user) navigate('/');
    handleExistingQuestions();
  }, []);

  const handleClose = () => {
    setModal(false);
  };

  const handleAlternativesArray = (one, two, three, four) => {
    setAlternatives([
      { answer: one, id: 1 },
      { answer: two, id: 2 },
      { answer: three, id: 3 },
      { answer: four, id: 4 },
    ]);
    setModalState('selectCorrect');
  };

  const handleAddToArray = () => {
    const completeQuestion = {
      questionText: newQuestion,
      answerOptions: [
        {
          answerText: alternatives[0].answer,
          id: alternatives[0].id,
          isCorrect: correctAlternative === alternatives[0].id,
        },
        {
          answerText: alternatives[1].answer,
          id: alternatives[1].id,
          isCorrect: correctAlternative === alternatives[1].id,
        },
        {
          answerText: alternatives[2].answer,
          id: alternatives[2].id,
          isCorrect: correctAlternative === alternatives[2].id,
        },
        {
          answerText: alternatives[3].answer,
          id: alternatives[3].id,
          isCorrect: correctAlternative === alternatives[3].id,
        },
      ],
    };
    setNewQuestionList((prevValue) => [...prevValue, completeQuestion]);
    setModalState('question');
    setNewQuestion('');
    setAlternative1('');
    setAlternative2('');
    setAlternative3('');
    setAlternative4('');
    setAlternatives([]);
    setCorrectAlternative();
  };

  const sendDataToFirebase = async () => {
    setLoading(true);
    newQuestionList.forEach(async (entry) => {
      const match = collection(db, 'questions');
      return addDoc(match, {
        questionText: entry.questionText,
        answerOptions: entry.answerOptions,
      });
    });
    setModal(false);
    setLoading(false);
  };

  const modalContent = () => {
    switch (modalState) {
      case 'question':
        return (
          <StyledCreation>
            <TextInput
              placeholder="Nova pergunta"
              value={newQuestion}
              onTextChange={(value) => setNewQuestion(value)}
            />
            {newQuestion.length > 10 ? (
              <Button
                onClick={() => setModalState('alternatives')}
                child="Continuar"
              />
            ) : null}
          </StyledCreation>
        );
      case 'alternatives':
        return (
          <StyledCreation>
            <p>{newQuestion}</p>
            <TextInput
              placeholder="Alternativa 1"
              value={alternative1}
              onTextChange={(value) => setAlternative1(value)}
            />
            <TextInput
              placeholder="Alternativa 2"
              value={alternative2}
              onTextChange={(value) => setAlternative2(value)}
            />
            <TextInput
              placeholder="Alternativa 3"
              value={alternative3}
              onTextChange={(value) => setAlternative3(value)}
            />
            <TextInput
              placeholder="Alternativa 4"
              value={alternative4}
              onTextChange={(value) => setAlternative4(value)}
            />
            {alternative1.length > 0 &&
            alternative2.length > 0 &&
            alternative3.length > 0 &&
            alternative4.length > 0 ? (
              <Button
                child="Continuar"
                onClick={() =>
                  handleAlternativesArray(
                    alternative1,
                    alternative2,
                    alternative3,
                    alternative4
                  )
                }
              />
            ) : null}
          </StyledCreation>
        );
      case 'selectCorrect':
        return (
          <StyledCreation>
            <p>Escolha a alternativa correta</p>
            <Select
              selectedOption={
                alternatives?.find((alt) => alt?.id === correctAlternative?.id)
                  ?.id
              }
              discreet
              complex
              selectstyle={{ width: 359 }}
              options={alternatives}
              onOptionClick={(option) => setCorrectAlternative(option)}
              defaultPlaceholder="Alternativas"
            />
            <Button onClick={() => handleAddToArray()} child="Confirmar" />
          </StyledCreation>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <MainWindow>
        <div>
          <StyledHeader>Perguntas existentes na aplicação</StyledHeader>
          <ul>
            {existingQuestions?.map((question) => (
              <li>{question?.questionText}</li>
            ))}
          </ul>
          <Button
            onClick={() => {
              setModal(true);
            }}
            child="Criar novas perguntas"
          />
        </div>
      </MainWindow>
      <Modal
        show={modal}
        onClose={() => handleClose()}
        onGoBack={() => handleClose()}
        title="Utilize este pop-up para criar novas perguntas"
      >
        <div>
          {newQuestionList.map((nq) => (
            <div>
              <p>{nq.questionText}</p>
              <ul>
                {nq.answerOptions.map((ao) => (
                  <li>
                    {ao.answerText} {ao.isCorrect ? '- Resposta correta' : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {modalContent()}
          <Button
            onClick={() => {
              sendDataToFirebase();
            }}
            child="Finalizar"
            loading={loading}
          />
        </div>
      </Modal>
    </>
  );
}

const StyledCreation = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-around;
  padding: 25px;
`;

export default NewQuestions;
