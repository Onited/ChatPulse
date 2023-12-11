import React from 'react';
import './Sidebar.css'; // Assurez-vous de créer un fichier CSS pour la sidebar
import { useTheme } from '../../Utils/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
const Sidebar = () => {
    const { darkMode, toggleDarkMode} = useTheme();
    const { logout } = useAuth();

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/home');
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    if (darkMode){
        return (
            <div className="sidebar dark-mode-sidebar">
                <button className='dark-mode-button' onClick={toggleDarkMode}>Basculer le mode</button>
                <button className='logout-button dark-mode-button' onClick={handleLogout}>Logout</button>
                <p>Chat Rooms</p>
            </div>
        );
    }else{
        return (
            <div className="sidebar light-mode-sidebar">
                <button className='light-mode-button' onClick={toggleDarkMode}>Basculer le mode</button>
                <button className='logout-button light-mode-button' onClick={handleLogout}>Logout</button>
                <p>Chat Rooms</p>
            </div>
        );
    }

};

export default Sidebar;