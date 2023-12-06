import React from 'react';
import './Sidebar.css'; // Assurez-vous de créer un fichier CSS pour la sidebar
import { useTheme } from '../../Utils/ThemeContext';
const Sidebar = () => {
    const { darkMode, toggleDarkMode} = useTheme();

    if (darkMode){
        return (
            <div className="sidebar dark-mode-sidebar">
                <button onClick={toggleDarkMode}>Basculer le mode</button>
                <p>Chat Rooms</p>
            </div>
        );
    }else{
        return (
            <div className="sidebar light-mode-sidebar">
                <button onClick={toggleDarkMode}>Basculer le mode</button>
                <p>Chat Rooms</p>
            </div>
        );
    }

};

export default Sidebar;