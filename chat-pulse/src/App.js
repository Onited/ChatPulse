import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatBox from './components/Chat/ChatBox';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import NotFound from './components/Error/NotFound';
import PrivateRoute from './components/PrivateRoute.js';
import PublicRoute from './components/PublicRoute.js';
import Home from './components/Common/HomePage';
import { useTheme } from './Utils/ThemeContext';
import './App.css'; // Assurez-vous d'importer votre fichier CSS

function App() {
    const { darkMode } = useTheme();
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }else{
        document.body.classList.remove('dark-mode');
    }

    return (
        <Router>
            <div className='app-container'>
                    <Routes>
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Signup /></PublicRoute>} />
                        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                        <Route path="/home" element={<PublicRoute><Home /></PublicRoute>} />
                        <Route path="*" element={<NotFound />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/chat" element={<ChatBox />} />
                        </Route>
                    </Routes>
                </div>
        </Router>
    );
}

export default App;
