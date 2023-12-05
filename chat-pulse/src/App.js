// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatBox from './components/Chat/ChatBox';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import NotFound from './components/Error/NotFound';
import PrivateRoute from './components/PrivateRoute';
// Autres imports si nécessaire

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route path="/" element={<Login />} />
                <Route path="*" element={<NotFound/>} />
                <Route element={<PrivateRoute />}>
                <Route path="/chat" element={<ChatBox />} />
                {/* Vous pouvez ajouter d'autres routes privées ici */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
