/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import { StyledHeader } from '../components/Texts';

function Home({ history }) {
  const navigate = useNavigate();
  const handleLogAsGroup = async () => {
    history?.push(`/quiz/group`);
    navigate(`/quiz/group`);
  };

  const logAsAdmin = () => {
    history?.push('/admin');
    navigate('/admin');
  };

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
        >
          Sou organizador!
        </Button>{' '}
        <Button
          style={{ padding: 10, fontSize: 28, fontWeight: 'bold' }}
          onClick={() => handleLogAsGroup()}
        >
          Sou campista!
        </Button>
      </div>
    </MainWindow>
  );
}

export default Home;
