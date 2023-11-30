import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatBox from './components/Chat/ChatBox';
import Login from './components/Auth/Login';
// Autres imports si nécessaire

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" component={ChatBox} />
        <Route path="/login" component={Login} />
        {/* Autres routes si nécessaire */}
        <Route path="/" exact component={ChatBox} /> {/* Met ChatBox comme page d'accueil pour l'instant */}
      </Routes>
    </Router>
  );
}

export default App;