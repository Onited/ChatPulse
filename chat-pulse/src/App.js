// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatBox from './components/Chat/ChatBox';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
// Autres imports si nécessaire

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/chat" element={<ChatBox />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/" element={<ChatBox />} />
            </Routes>
        </Router>
    );
}

export default App;
