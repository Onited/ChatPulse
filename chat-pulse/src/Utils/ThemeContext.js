import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        return isDarkMode || false;
    });

    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const isSoundEnabled = localStorage.getItem('isSoundEnabled') !== 'false'; // Le son est activé par défaut sauf si explicitement désactivé
        return isSoundEnabled;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        localStorage.setItem('isSoundEnabled', isSoundEnabled); // Sauvegarde l'état du son dans localStorage
    }, [darkMode, isSoundEnabled]);

    const toggleDarkMode = () => setDarkMode(!darkMode);
    const toggleSound = () => setIsSoundEnabled(!isSoundEnabled); // Fonction pour basculer le son

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode, isSoundEnabled, toggleSound }}>
            {children}
        </ThemeContext.Provider>
    );
};
