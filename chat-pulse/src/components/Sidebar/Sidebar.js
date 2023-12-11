import React from 'react';
import ToggleButtons from '../../Utils/ToggleButtons';
import './Sidebar.css';
import { useTheme } from '../../Utils/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import { useEffect, useState } from 'react';
import { getFriends } from '../../Utils/Services/friendService';
const Sidebar = ({ switchComponent }) => {
    const { darkMode, toggleDarkMode } = useTheme();
    const { currentUser, logout } = useAuth();
    const [friends, setFriends] = useState([]);

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    useEffect(() => {
        const fetchFriends = async () => {
            if (currentUser) {
                const friendList = await getFriends(currentUser.uid);
                setFriends(friendList);
            }
        };

        fetchFriends();
    }, [currentUser]);

    return (
        <div className={`sidebar ${darkMode ? 'dark-mode-sidebar' : 'light-mode-sidebar'}`}>
            <button className={`${darkMode ? 'dark-mode-button' : 'light-mode-button'}`} 
            onClick={toggleDarkMode}>Basculer le mode</button>
            <button className={`${darkMode ? 'dark-mode-button' : 'light-mode-button'}`} 
            onClick={handleLogout}>Logout</button>
            <ToggleButtons switchComponent={switchComponent} />
            <p>Chat Rooms</p>
            <p>Friends</p>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>{friend.pseudo}</li> // Afficher le pseudo de l'ami
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;