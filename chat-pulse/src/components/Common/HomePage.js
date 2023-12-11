import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Utils/ThemeContext';
import './css/HomePage.css';

const HomePage = () => {
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
            <div className="container">
                <div className="home-container dark-mode-home">
                    <h1>Bienvenue sur ChatPulse</h1>
                    <p>Votre application de messagerie instantanée.</p>
                    <button onClick={goToLogin}>Se connecter</button>
                    <button onClick={goToRegister}>S'inscrire</button>
                </div>
            </div>
        );
    }else{
        return (
            <div className="container">
                <div className="home-container light-mode-home">
                    <h1>Bienvenue sur ChatPulse</h1>
                    <p>Votre application de messagerie instantanée.</p>
                    <button onClick={goToLogin}>Se connecter</button>
                    <button onClick={goToRegister}>S'inscrire</button>
                </div>
            </div>
        );
    }
};

export default HomePage;
