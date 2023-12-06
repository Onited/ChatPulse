import React, { useState } from 'react';
import { db } from '../../Utils/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../Utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import './css/MessageInput.css';

const MessageInput = () => {
    const [text, setText] = useState('');
    const { currentUser } = useAuth();
    const { logout } = useAuth();

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

    return (
        <div  className="footer-container">
            <form onSubmit={handleSubmit}>
                <input
                    className="textarea-message"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    rows={1}
                />
                <button className="send-button" type="submit">Send</button>
                <button className='logout-button' onClick={handleLogout}>Logout</button>
            </form>
        </div>
    );
};

export default MessageInput;
