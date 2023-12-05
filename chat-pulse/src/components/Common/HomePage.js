import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate('/login');
    };

    const goToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="home-container">
            <h1>Bienvenue sur ChatPulse</h1>
            <p>Votre application de messagerie instantanée.</p>
            <button onClick={goToLogin}>Se connecter</button>
            <button onClick={goToRegister}>S'inscrire</button>
        </div>
    );
};

export default HomePage;
