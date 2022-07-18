import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import TextInput from '../components/TextInput';
import { StyledHeader } from '../components/Texts';
import { db } from '../firebase';
import Select from '../components/Select';

function LogAsGroup({ history }) {
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState();
  const [selectedGroup, setSelectedGroup] = useState();

  const token = localStorage.getItem('group');
  const handleGroups = async () => {
    const g = query(collection(db, 'group'));
    onSnapshot(g, (querySnapshot) => {
      setGroups(querySnapshot.docs.map((d) => d.data()));
    });
  };

  const handleEffect = () => {
    if (token) {
      history?.push(`/quiz/${token}`);
      window.location.assign(`/quiz/${token}`);
    } else {
      handleGroups();
    }
  };
  useEffect(() => {
    handleEffect();
  }, []);

  const handleLogAsGroup = (e) => {
    setSelectedGroup(e);
    localStorage.setItem('group', e);
    history?.push(`/quiz/${e}`);
    window.location.assign(`/quiz/${e}`);
  };

  const handleCreateGroup = (name) => {
    const group = collection(db, 'group');
    addDoc(group, {
      groupName: name,
      score: 0,
      id: uuidv4(),
    })
      .then((res) => {
        localStorage.setItem('group', res.id);
        history?.push(`/quiz/${res.id}`);
        window.location.assign(`/quiz/${res.id}`);
      })
      .catch((e) => {
        alert('Não foi possível criar o grupo', e);
      });
  };

  return (
    <MainWindow style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <StyledHeader>Criar grupo</StyledHeader>
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
        <Button
          style={{ marginTop: 20 }}
          onClick={() => {
            history?.push(`/dash`);
            window.location.assign(`/dash`);
          }}
        >
          Ir para o dash
        </Button>
        <Select
          selectedOption={
            groups?.find((group) => group?.name === selectedGroup?.name)?.name
          }
          options={groups}
          discreet
          complex
          selectstyle={{ width: 359 }}
          onOptionClick={(e) => handleLogAsGroup(e)}
        />
      </div>
    </MainWindow>
  );
}

export default LogAsGroup;
