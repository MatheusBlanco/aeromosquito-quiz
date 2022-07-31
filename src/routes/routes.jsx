import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LogAsGroup from '../screens/LogAsGroup';
import Quiz from '../screens/Quiz';
import CreateMatch from '../screens/CreateMatch';
import GroupAnswering from '../screens/GroupAnswering';
import Home from '../screens/Home';
import Admin from '../screens/Admin';
import NewQuestions from '../screens/NewQuestions';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/quiz/group" element={<LogAsGroup />} />
      <Route path="/quiz/:match" element={<Quiz />} />
      <Route exact path="quiz/group/:match" element={<GroupAnswering />} />
      <Route path="/dash" element={<CreateMatch />} />
      <Route path="/newQuestions" element={<NewQuestions />} />
    </Routes>
  );
}

export default Router;
