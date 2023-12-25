import React from 'react';
import './css/ToggleButtons.css';
import { useTheme } from './ThemeContext';

const ToggleButtons = ({ switchComponent }) => {
    const { darkMode } = useTheme();

    return (
        <div>
            <button className={`${darkMode ? 'dark-mode-button' : 'light-mode-button'}`}
            onClick={() => switchComponent('userSearch')}>Trouver un ami</button>
            <button className={`${darkMode ? 'dark-mode-button' : 'light-mode-button'}`}
            onClick={() => switchComponent('friendRequests')}>Mes demandes d'amis</button>
            <button className={`${darkMode ? 'dark-mode-button' : 'light-mode-button'}`}
            onClick={() => switchComponent('chatBox')}>Chat General</button>
        </div>
    );
};

export default ToggleButtons;