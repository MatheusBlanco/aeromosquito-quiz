/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import { StyledHeader } from '../components/Texts';
import { auth, signInWithGoogle } from '../firebase';

function Home({ history }) {
  const [user] = useAuthState(auth);

  const navigate = useNavigate();
  const handleLogAsGroup = async () => {
    history?.push(`/quiz/group`);
    navigate(`/quiz/group`);
  };

  const logAsAdmin = () => {
    signInWithGoogle();
  };

  useEffect(() => {
    if (user) {
      history?.push('/dash');
      navigate('/dash');
    }
  }, [user]);

  return (
    <MainWindow style={{ display: 'flex', flexDirection: 'column' }}>
      <StyledHeader>Bem vindo!</StyledHeader>
      <h3>Por favor, escolha sua forma de participação</h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '120px',
        }}
      >
        <Button
          style={{ padding: 10, fontSize: 28, fontWeight: 'bold' }}
          onClick={() => logAsAdmin()}
          child="Sou organizador"
        />{' '}
        <Button
          style={{ padding: 10, fontSize: 28, fontWeight: 'bold' }}
          onClick={() => handleLogAsGroup()}
          child="Sou campista"
        />
      </div>
    </MainWindow>
  );
}

export default Home;
