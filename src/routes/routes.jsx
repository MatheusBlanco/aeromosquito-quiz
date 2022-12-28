import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Admin from '../screens/Admin';
import Dashboard from '../screens/Dashboard';
import GroupAnswering from '../screens/GroupAnswering';
import Home from '../screens/Home';
import LogAsGroup from '../screens/LogAsGroup';
import MatchParams from '../screens/MatchParams';
import NewQuestions from '../screens/NewQuestions';
import Quiz from '../screens/Quiz';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/quiz/group" element={<LogAsGroup />} />
      <Route path="/quiz/:match" element={<Quiz />} />
      <Route exact path="quiz/group/:match" element={<GroupAnswering />} />
      <Route path="/dash" element={<Dashboard />} />
      <Route path="/matchParams" element={<MatchParams />} />
      <Route path="/newQuestions" element={<NewQuestions />} />
    </Routes>
  );
}

export default Router;
