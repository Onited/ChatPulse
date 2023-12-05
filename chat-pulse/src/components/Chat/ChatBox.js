// Chat.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';

const ChatBox = () => {
    const { currentUser, logout } = useAuth(); // useAuth doit fournir une méthode signOut
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout(); // Utilisez la méthode signOut de Firebase
            navigate('/login'); // Redirigez l'utilisateur vers la page de connexion après la déconnexion
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    return (
        <div>
            {currentUser && <p>Vous êtes connecté avec l'adresse mail: {currentUser.email}</p>}
            {/* ... contenu du chat ... */}
            <button onClick={handleLogout}>Déconnexion</button>
        </div>
    );
};

export default ChatBox;
