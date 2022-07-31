import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle } from '../firebase';
import { MainWindow } from '../components/MainWindow';
import Button from '../components/Button';

function Login() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate('/dash');
  }, [user, loading]);
  return (
    <MainWindow>
      <div>
        <Button type="button" onClick={signInWithGoogle}>
          Logar com Google
        </Button>
      </div>
    </MainWindow>
  );
}
export default Login;
