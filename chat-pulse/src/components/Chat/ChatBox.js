import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../Utils/firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Message from './Message';
import MessageInput from './MessageInput';
import './css/ChatBox.css';
import messageReceivedSound from '../../sounds/COMCell_Message 1 (ID 1111)_LS.wav';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const lastMessageRef = useRef(null);
    const lastMessageId = useRef(""); // Ajoutez une référence pour stocker l'ID du dernier message

    useEffect(() => {
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            if (fetchedMessages.length > 0) {
                const lastFetchedMessageId = fetchedMessages[fetchedMessages.length - 1].id;
                // Jouer le son seulement si un nouveau message est ajouté, et non lors du premier chargement
                if (lastMessageId.current && lastMessageId.current !== lastFetchedMessageId) {
                    new Audio(messageReceivedSound).play();
                }
                // Mettre à jour l'ID du dernier message reçu
                lastMessageId.current = lastFetchedMessageId;
            }

            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-box">
            <div className="">
                {messages.map((message, index) => (
                    <Message 
                        key={message.id} 
                        message={message} 
                        ref={index === messages.length - 1 ? lastMessageRef : null}
                    />
                ))}
            </div>
            <MessageInput />
        </div>
    );
};

export default ChatBox;
