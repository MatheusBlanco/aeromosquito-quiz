import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { MainWindow } from '../components/styles/MainWindow';
import { StyledHeader } from '../components/styles/Texts';
import Button from '../components/styles/Button';

function PointsDash() {
  const [groups, setGroups] = useState();
  const handleGroups = async () => {
    const g = query(collection(db, 'group'));

    onSnapshot(g, (querySnapshot) => {
      setGroups(querySnapshot.docs.map((d) => d.data()));
    });
  };

  useEffect(() => {
    handleGroups();
  }, []);

  return (
    <MainWindow style={{ display: 'flex', flexDirection: 'column' }}>
      <StyledHeader>Scores dos grupos</StyledHeader>
      {groups?.map((group) => (
        <Button disabled>
          {group.groupName} - {group.score}
        </Button>
      ))}
    </MainWindow>
  );
}

export default PointsDash;
