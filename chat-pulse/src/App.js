import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NotificationProvider } from './Utils/NotificationContext.js';
import NotificationSound from './Utils/NotificationSound.js';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import NotFound from './components/Error/NotFound';
import PrivateRoute from './components/PrivateRoute.js';
import PublicRoute from './components/PublicRoute.js';
import WelcomePage from './components/Common/WelcomePage.js';
import HomePage from './components/Common/HomePage.js';
import { useTheme } from './Utils/ThemeContext';
import './App.css';

function App() {
    const { darkMode } = useTheme();
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    return (
        <Router>
            <NotificationProvider> {/* Enveloppez avec NotificationProvider */}
                <NotificationSound /> {/* Ajoutez NotificationSound */}
                <div className='app-container'>
                    <Routes>
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/register" element={<PublicRoute><Signup /></PublicRoute>} />
                        <Route path="/" element={<PublicRoute><WelcomePage /></PublicRoute>} />
                        <Route path="*" element={<NotFound />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/home" element={<HomePage />} />
                        </Route>
                    </Routes>
                </div>
            </NotificationProvider>
        </Router>
    );
}

export default App;
