import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';

const ChatBox = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/home');
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <div>
            {currentUser && <p>Vous êtes connecté avec l'adresse mail: {currentUser.email}</p>}
            <button onClick={handleLogout}>Déconnexion</button>
        </div>
    );
};

export default ChatBox;
