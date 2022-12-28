import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { MainWindow } from '../components/MainWindow';
import { auth, signInWithGoogle } from '../firebase';

function Login() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    signInWithGoogle();

    if (user) navigate('/dash');
  }, [user, loading]);

  return (
    <MainWindow
      color={
        localStorage.getItem('color') ? localStorage.getItem('color') : 'green'
      }
    >
      <div>
        <Button
          type="button"
          onClick={signInWithGoogle}
          child="Logar com Google"
        />
      </div>
    </MainWindow>
  );
}
export default Login;
