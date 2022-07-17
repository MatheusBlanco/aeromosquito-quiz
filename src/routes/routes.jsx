import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LogAsGroup from '../screens/LogAsGroup';
import Quiz from '../screens/Quiz';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<LogAsGroup />} />
      <Route path="/quiz/:groupId" element={<Quiz />} />
    </Routes>
  );
}

export default Router;
