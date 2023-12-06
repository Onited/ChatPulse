import React, { useState } from 'react';
import { db } from '../../Utils/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../Utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Utils/ThemeContext';
import './css/MessageInput.css';

const MessageInput = () => {
    const [text, setText] = useState('');
    const { currentUser } = useAuth();
    const { logout } = useAuth();
    const { darkMode } = useTheme();

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        await addDoc(collection(db, 'messages'), {
            text: text,
            uid: currentUser.uid,
            pseudo: currentUser.displayName,  // Assurez-vous que le pseudo est récupéré depuis l'état currentUser
            timestamp: serverTimestamp(),
        });

        setText('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(text);
    };


    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/home');
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(text);
            setText('');
        }
    };

    if (darkMode) {
        return (

            <div className="footer-container dark-mode-footer">
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="textarea-message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                    />
                    <button className="send-button" type="submit">Send</button>
                    <button className='logout-button' onClick={handleLogout}>Logout</button>
                </form>
            </div>
        );
    } else {
        return (
            <div className="footer-container light-mode-footer">
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="textarea-message"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        rows={1}
                    />
                    <button className="send-button" type="submit">Send</button>
                    <button className='logout-button' onClick={handleLogout}>Logout</button>
                </form>
            </div>
        );
    }
};

export default MessageInput;
