import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../Utils/firebaseConfig';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import Message from './Message';
import MessageInput from './MessageInput';
import './css/ChatBox.css';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const lastMessageRef = useRef(null);
    const lastMessageId = useRef("");

    useEffect(() => {
        const messagesRef = collection(db, 'conversations', 'global', 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(20));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            if (fetchedMessages.length > 0) {
                const lastFetchedMessageId = fetchedMessages[fetchedMessages.length - 1].id;
                lastMessageId.current = lastFetchedMessageId;
            }

            setMessages(fetchedMessages);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (lastMessageRef.current) {
                lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
    
        return () => clearTimeout(timer);
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
