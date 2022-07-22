import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LogAsGroup from '../screens/LogAsGroup';
import Quiz from '../screens/Quiz';
import CreateMatch from '../screens/CreateMatch';
import GroupAnswering from '../screens/GroupAnswering';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<LogAsGroup />} />
      <Route path="/quiz/:match" element={<Quiz />} />
      <Route exact path="quiz/group/:match" element={<GroupAnswering />} />
      <Route path="/dash" element={<CreateMatch />} />
    </Routes>
  );
}

export default Router;
