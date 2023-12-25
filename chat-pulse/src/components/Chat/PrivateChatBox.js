// PrivateChatBox.js
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../Utils/firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import Message from './Message';
import MessageInput from './MessageInput';
import './css/ChatBox.css';
import { useAuth } from '../../Utils/AuthContext'; 

const PrivateChatBox = ({ conversationId }) => {
    const [messages, setMessages] = useState([]);
    const lastMessageRef = useRef(null);
    const lastMessageId = useRef("");
    const { currentUser } = useAuth();

    const handleSendMessage = async (text, gifUrl) => {
        let messageContent;
        if (gifUrl) {
            messageContent = { gifUrl: gifUrl, uid: currentUser.uid, pseudo: currentUser.pseudo };
        } else if (text.trim() !== '') {
            messageContent = { text: text, uid: currentUser.uid, pseudo: currentUser.pseudo };
        } else {
            return;
        }
        
        await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
            ...messageContent,
            timestamp: serverTimestamp(),
        });
    };

    useEffect(() => {
        if (conversationId) {
            const messagesRef = collection(db, 'conversations', conversationId, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(20));
            
            let isInitialLoad = true;
            
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetchedMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMessages(fetchedMessages);
                
                if (fetchedMessages.length > 0) {
                    const newLastMessageId = fetchedMessages[fetchedMessages.length - 1].id;
                    if (newLastMessageId !== lastMessageId.current && !isInitialLoad) {
                        lastMessageId.current = newLastMessageId;
                    }
                    isInitialLoad = false;
                }
            });
            
            return () => unsubscribe();
        }
    }, [conversationId]);

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
            <div className="messages-list">
                {messages.map((message, index) => (
                    <Message
                        key={message.id}
                        message={message}
                        ref={index === messages.length - 1 ? lastMessageRef : null}
                    />
                ))}
            </div>
            <MessageInput onSendMessage={handleSendMessage} conversationId={conversationId} />
        </div>
    );
};

export default PrivateChatBox;
