import { collection, onSnapshot, query } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import Modal from '../components/Modal';
import { StyledHeader } from '../components/Texts';
import { auth, db } from '../firebase';

function NewQuestions() {
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [modal, setModal] = useState(false);
  const [user] = useAuthState(auth);
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
          >
            Criar novas perguntas
          </Button>
        </div>
      </MainWindow>
      <Modal
        show={modal}
        onClose={() => handleClose()}
        hasGoBack
        modalHeight="835"
        onGoBack={() => handleClose()}
        height="650"
        title="Criação de perguntas"
      >
        <p>Twat</p>
      </Modal>
    </>
  );
}

export default NewQuestions;
