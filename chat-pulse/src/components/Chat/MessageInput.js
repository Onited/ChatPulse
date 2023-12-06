import React, { useState } from 'react';
import { db } from '../../Utils/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../Utils/AuthContext';

const MessageInput = () => {
    const [text, setText] = useState('');
    const { currentUser } = useAuth();

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

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default MessageInput;
