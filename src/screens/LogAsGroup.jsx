/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
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
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import TextInput from '../components/TextInput';
import { StyledHeader } from '../components/Texts';
import { db } from '../firebase';

function LogAsGroup({ history }) {
  const [groupName, setGroupName] = useState('');
  const [matches, setmatches] = useState();
  const [matchCode, setMatchCode] = useState('');
  const [matchCodeError, setMatchCodeError] = useState(false);
  const [missingGroup, setMissingGroup] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleMatches = async () => {
    const m = query(collection(db, 'match'));
    onSnapshot(m, (querySnapshot) => {
      setmatches(querySnapshot.docs.map((d) => d.data()));
    });
  };

  useEffect(() => {
    handleMatches();
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

    querySnapshot.forEach(async (document) => {
      await updateDocuments(document, name, groupId);
    });
  };

  const validateMatchCode = (code) =>
    matches.find((match) => {
      if (match.cod !== code.toUpperCase()) {
        return false;
      }
      return true;
    });

  const handleLogAsGroup = async (name, match) => {
    setLoading(true);
    const error = validateMatchCode(match);
    if (error === undefined) {
      setMatchCodeError(true);
    } else {
      setMatchCodeError(false);
      if (name.length === 0 || name.length < 6) {
        setMissingGroup(true);
      } else {
        setMissingGroup(false);
        const groupId = await handleCreateGroup(name);
        await updateMatchWithGroup(name, match, groupId);
        localStorage.setItem('group', groupId);
        history?.push(`/quiz/group/${match}`);
        navigate(`/quiz/group/${match}`);
      }
    }
    setLoading(false);
  };

  return (
    <MainWindow style={{ display: 'flex', flexDirection: 'column' }}>
      <StyledHeader>Iniciar jogo</StyledHeader>
      <TextInput
        label="Nome do Grupo"
        value={groupName}
        onTextChange={(value) => setGroupName(value)}
        type="text"
        wrongData={missingGroup}
        wrongDataMessage="Insira um nome de grupo válido"
      />

      <TextInput
        label="Inserir código da partida"
        value={matchCode}
        onTextChange={(value) => setMatchCode(value)}
        wrongData={matchCodeError}
        wrongDataMessage={
          matchCodeError ? 'Código inexistente. Insira um código válido' : ''
        }
        type="text"
      />
      <Button
        style={{ marginTop: 20 }}
        onClick={() => handleLogAsGroup(groupName, matchCode)}
        child="Conectar com partida"
        loading={loading}
      />
    </MainWindow>
  );
}

export default LogAsGroup;
