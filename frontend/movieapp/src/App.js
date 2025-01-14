import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Welcome from './Welcome';
import MovieInfo from './MovieInfo';
import Horror from './Horror';
import Suspense from './Suspense';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/suspense" element={<Suspense />} />
        <Route path="/horror" element={<Horror />} />
        <Route path="/movie/:movieId" element={<MovieInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
