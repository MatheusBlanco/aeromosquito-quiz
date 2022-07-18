/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { MainWindow } from '../components/MainWindow';
import { StyledHeader } from '../components/Texts';
import Button from '../components/Button';
import Select from '../components/Select';

function PointsDash({ history }) {
  const [selectedGroup1, setselectedGroup1] = useState();
  const [selectedGroup2, setselectedGroup2] = useState();
  const [group1, setGroup1] = useState([]);
  const [group2, setGroup2] = useState([]);

  const [groups, setGroups] = useState();
  const handleGroups = async () => {
    const g = query(collection(db, 'group'));

    onSnapshot(g, (querySnapshot) => {
      setGroups(querySnapshot.docs.map((d) => d.data()));
    });
  };

  const logout = () => {
    localStorage.removeItem('group');
    history?.push('/');
    window.location.assign('/');
  };

  useEffect(() => {
    groups?.filter((group) => {
      if (group.id === selectedGroup1) {
        setGroup1(group);
      }
    });
  }, [selectedGroup1]);

  useEffect(() => {
    groups?.filter((group) => {
      if (group.id === selectedGroup2) {
        setGroup2(group);
      }
    });
  }, [selectedGroup2]);

  useEffect(() => {
    handleGroups();
  }, []);

  return (
    <MainWindow style={{ display: 'flex', flexDirection: 'column' }}>
      <StyledHeader>Scores dos grupos</StyledHeader>
      <p>Escolha dois grupos para mostrar o score</p>
      <Select
        selectedOption={
          groups?.find((group) => group?.name === selectedGroup1?.name)?.name
        }
        options={groups}
        discreet
        complex
        selectstyle={{ width: 359 }}
        onOptionClick={(e) => setselectedGroup1(e)}
      />
      <p>
        {group1.groupName} - {group1.score}
      </p>
      <Select
        selectedOption={
          groups?.find((group) => group?.name === selectedGroup2?.name)?.name
        }
        options={groups}
        discreet
        complex
        selectstyle={{ width: 359 }}
        onOptionClick={(e) => setselectedGroup2(e)}
      />
      <p>
        {group2.groupName} - {group2.score}
      </p>
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

export default PointsDash;
