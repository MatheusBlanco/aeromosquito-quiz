import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LogAsGroup from '../screens/LogAsGroup';
import Quiz from '../screens/Quiz';
import PointsDash from '../screens/PointsDash';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<LogAsGroup />} />
      <Route path="/quiz/:groupId" element={<Quiz />} />
      <Route path="/dash" element={<PointsDash />} />
    </Routes>
  );
}

export default Router;
