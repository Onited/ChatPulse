import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import { useTheme } from '../../Utils/ThemeContext';
import { listenForFriends, startOrGetPrivateConversation } from '../../Utils/Services/friendService';
import './Sidebar.css';
import ToggleButtons from '../../Utils/ToggleButtons';
import { useNotification } from '../../Utils/NotificationContext';

const Sidebar = ({ setActiveConversation, switchComponent }) => {
    const { darkMode, toggleDarkMode } = useTheme();
    const { currentUser, logout } = useAuth();
    const [friends, setFriends] = useState([]);
    const navigate = useNavigate();
    const { isSoundEnabled, setIsSoundEnabled } = useNotification();
    
    const toggleSound = () => {
        setIsSoundEnabled(!isSoundEnabled);
    };

    useEffect(() => {
        if (currentUser?.uid) {
            const unsubscribe = listenForFriends(currentUser.uid, setFriends);
            return unsubscribe;
        }
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    const handleStartPrivateChat = async (friendId) => {
        const conversationId = await startOrGetPrivateConversation(currentUser.uid, friendId);
        switchComponent('PrivateChat', conversationId);
    };    

    return (
        <div className={`sidebar ${darkMode ? 'dark-mode-sidebar' : 'light-mode-sidebar'}`}>
            <button className={`${darkMode ? 'dark-mode-button' : 'light-mode-button'}`} onClick={toggleDarkMode}>
                Basculer le mode
            </button>
            <button className={`${darkMode ? 'dark-mode-button' : 'light-mode-button'}`} onClick={handleLogout}>
                Logout
            </button>
            <button className={`${darkMode ? 'dark-mode-button' : 'light-mode-button'}`} onClick={toggleSound}>
                {isSoundEnabled ? 'Couper le son' : 'Activer le son'}
            </button>
            <ToggleButtons switchComponent={switchComponent} />
            <p>Chat Rooms</p>
            <p>Friends</p>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        <button className={`${darkMode ? 'dark-mode-button' : 'light-mode-button'}`}
                            onClick={() => handleStartPrivateChat(friend.id)}>{friend.pseudo}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;