// // src/components/Chat/ChatBox.js
// import React, { useState, useEffect } from 'react';
// import { db } from '../../Utils/firebaseConfig';
// import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
// import Message from './Message';
// import MessageInput from './MessageInput';
// import './css/ChatBox.css';

// const ChatBox = () => {
//     const [messages, setMessages] = useState([]);
    

//     useEffect(() => {
//         const messagesRef = collection(db, 'messages');
//         const q = query(messagesRef, orderBy('timestamp', 'asc'));

//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const fetchedMessages = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             setMessages(fetchedMessages);
//         });

//         return () => unsubscribe();
//     }, []);


//     return (
//         <div className="chat-box">
//             <div className="messages-container">
//                 {messages.map((message) => (
//                     <Message key={message.id} message={message} />
//                 ))}
//             </div>
//             <div className='footer-container'>
//             <MessageInput />
//             </div>
//         </div>
//     );
// };

// export default ChatBox;
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../Utils/firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Message from './Message';
import MessageInput from './MessageInput';
import './css/ChatBox.css';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const lastMessageRef = useRef(null);

    useEffect(() => {
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
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
            <div className="messages-container">
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
