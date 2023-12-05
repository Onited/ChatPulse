// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../Utils/AuthContext';

// const ChatBox = () => {
//     const { currentUser, logout } = useAuth();
//     const navigate = useNavigate();

//     const handleLogout = async () => {
//         try {
//             await logout();
//             navigate('/home');
//         } catch (error) {
//             console.error("Erreur lors de la déconnexion:", error);
//         }
//     };

//     return (
//         <div>
//             {currentUser && <p>Vous êtes connecté avec l'adresse mail: {currentUser.email}</p>}
//             <button onClick={handleLogout}>Déconnexion</button>
//         </div>
//     );
// };

// export default ChatBox;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../Utils/AuthContext';
// import { db } from '../../Utils/firebaseConfig';
// import Message from './Message';
// import MessageInput from './MessageInput';

// const ChatBox = () => {
//     const [messages, setMessages] = useState([]);
//     const { currentUser, logout } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {

//         const unsubscribe = db.collection('messages')
//             .orderBy('timestamp', 'asc')
//             .onSnapshot(snapshot => {
//                 setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
//             });


//         return () => unsubscribe();
//     }, []);

    // const handleLogout = async () => {
    //     try {
    //         await logout();
    //         navigate('/home'); // Assurez-vous que cette route existe
    //     } catch (error) {
    //         console.error("Erreur lors de la déconnexion:", error);
    //     }
    // };

//     const sendMessage = async (text) => {
//         if (!text.trim()) return;
//         const message = {
//             text,
//             timestamp: db.FieldValue.serverTimestamp(),
//             uid: currentUser.uid
//         };
//         await db.collection('messages').add(message);
//     };

//     return (
//         <div>
//             {currentUser && <p>Vous êtes connecté avec l'adresse mail: {currentUser.email}</p>}
//             <div className="messages-list">
//                 {messages.map(msg => (
//                     <Message key={msg.id} message={msg} />
//                 ))}
//             </div>
//             <MessageInput onSendMessage={sendMessage} />
//             <button onClick={handleLogout}>Déconnexion</button>
//         </div>
//     );
// };

// export default ChatBox;


// src/components/Chat/ChatBox.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../Utils/firebaseConfig'; // Assurez-vous que le chemin est correct
import { useAuth } from '../../Utils/AuthContext';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Message from './Message';
import MessageInput from './MessageInput';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const { logout } = useAuth();

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
        <div className="chat-box">
            {/* Liste des messages */}
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
            <MessageInput />
            <button onClick={handleLogout}>Déconnexion</button>
        </div>
    );
};

export default ChatBox;