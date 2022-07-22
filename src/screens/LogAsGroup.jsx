import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  where,
  updateDoc,
  getDocs,
  doc,
  query,
  arrayUnion,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import TextInput from '../components/TextInput';
import { StyledHeader } from '../components/Texts';
import { db } from '../firebase';
import Select from '../components/Select';

function LogAsGroup({ history }) {
  const [groupName, setGroupName] = useState('');
  const [matches, setmatches] = useState();

  const [selectedMatch, setselectedMatch] = useState();

  const handleMatches = async () => {
    const m = query(collection(db, 'match'));
    onSnapshot(m, (querySnapshot) => {
      setmatches(querySnapshot.docs.map((d) => d.data()));
    });
  };

  const handleEffect = () => {
    handleMatches();
  };
  useEffect(() => {
    handleEffect();
  }, []);

  const handleCreateGroup = async (name) => {
    const group = collection(db, 'group');
    const createdId = await addDoc(group, {
      groupName: name,
      score: 0,
      id: uuidv4(),
    })
      .then((res) => res.id)
      .catch((e) => {
        alert('Não foi possível criar o grupo', e);
      });
    return createdId;
  };

  const updateDocuments = async (document, name, groupId) => {
    const documentRef = doc(db, 'match', document.id);

    await updateDoc(
      documentRef,
      'groups',
      arrayUnion({
        groupName: name,
        groupId,
        score: 0,
        questionsAnswered: 0,
      })
    );
  };

  const updateMatchWithGroup = async (name, match, groupId) => {
    const q = query(collection(db, 'match'), where('cod', '==', match));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((document) => {
      updateDocuments(document, name, groupId);
    });
  };

  const handleLogAsGroup = async (name, match) => {
    const groupId = await handleCreateGroup(name);
    await updateMatchWithGroup(name, match, groupId);
    localStorage.setItem('group', groupId);
    history?.push(`/quiz/group/${match}`);
    window.location.assign(`/quiz/group/${match}`);
  };

  return (
    <MainWindow style={{ display: 'flex', flexDirection: 'column' }}>
      <StyledHeader>Criar grupo</StyledHeader>
      <TextInput
        label="Nome do Grupo"
        value={groupName}
        onTextChange={(value) => setGroupName(value)}
        type="text"
      />

      <StyledHeader>Selecionar partida</StyledHeader>
      <Select
        selectedOption={
          matches?.find((match) => match?.cod === selectedMatch?.cod)?.cod
        }
        options={matches}
        discreet
        complex
        selectstyle={{ width: 359 }}
        onOptionClick={(e) => setselectedMatch(e)}
      />
      <Button
        style={{ marginTop: 20 }}
        onClick={() => handleLogAsGroup(groupName, selectedMatch)}
      >
        Conectar com partida
      </Button>

      <Button
        style={{ marginTop: 20 }}
        onClick={() => {
          history?.push(`/dash`);
          window.location.assign(`/dash`);
        }}
      >
        Ir para o dash
      </Button>
    </MainWindow>
  );
}

export default LogAsGroup;
