import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import Button from '../components/styles/Button';
import { MainWindow } from '../components/styles/MainWindow';
import TextInput from '../components/styles/TextInput';
import { StyledHeader } from '../components/styles/Texts';
import { db } from '../firebase';

function LogAsGroup({ history }) {
  const [groupName, setGroupName] = useState('');

  const token = localStorage.getItem('group');

  useEffect(
    () => () => {
      if (token) {
        history?.push(`/quiz/${token}`);
        window.location.assign(`/quiz/${token}`);
      }
    },
    []
  );

  const handleCreateGroup = (name) => {
    const group = collection(db, 'group');
    addDoc(group, {
      groupName: name,
      score: 0,
    })
      .then((res) => {
        history?.push(`/quiz/${res.id}`);
        window.location.assign(`/quiz/${res.id}`);
        localStorage.setItem('group', res.id);
      })
      .catch((e) => {
        alert('Não foi possível criar o grupo', e);
      });
  };

  return (
    <MainWindow windowStyle={{ display: 'flex', flexDirection: 'row' }}>
      <div windowStyle={{ display: 'flex', flexDirection: 'row' }}>
        <StyledHeader>lol</StyledHeader>
        <TextInput
          label="Nome do Grupo"
          value={groupName}
          onTextChange={(value) => setGroupName(value)}
          type="text"
        />
        <Button
          style={{ marginTop: 20 }}
          onClick={() => handleCreateGroup(groupName)}
        >
          Criar grupo
        </Button>
      </div>
    </MainWindow>
  );
}

export default LogAsGroup;
