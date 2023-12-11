import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Utils/ThemeContext';
import './css/WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();


    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };
    if (darkMode) {
        return (
            <div className="welcome-page-container">
                <div className="welcome-container dark-mode-welcome">
                    <h1>Bienvenue sur ChatPulse</h1>
                    <p>Votre application de messagerie instantanée.</p>
                    <button onClick={goToLogin}>Se connecter</button>
                    <button onClick={goToRegister}>S'inscrire</button>
                </div>
            </div>
        );
    }else{
        return (
            <div className="welcome-page-container">
                <div className="welcome-container light-mode-welcome">
                    <h1>Bienvenue sur ChatPulse</h1>
                    <p>Votre application de messagerie instantanée.</p>
                    <button onClick={goToLogin}>Se connecter</button>
                    <button onClick={goToRegister}>S'inscrire</button>
                </div>
            </div>
        );
    }
};

export default WelcomePage;
