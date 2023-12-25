import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, onSnapshot, query, orderBy, limit, where} from 'firebase/firestore';
import { useAuth } from './AuthContext'; 

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [lastMessage, setLastMessage] = useState(null);
    const { currentUser } = useAuth(); 
    const [isSoundEnabled, setIsSoundEnabled] = useState(true); 


    useEffect(() => {
        if (!currentUser) {
            return;
        }
    
        let unsubscribes = [];
        
        // Écoute de la conversation globale
        const globalChatRef = collection(db, 'conversations', 'global', 'messages');
        const globalChatQuery = query(globalChatRef, orderBy('timestamp', 'desc'), limit(1));
        
        unsubscribes.push(onSnapshot(globalChatQuery, (snapshot) => {
            if (!snapshot.empty) {
                const newMessage = snapshot.docs[0].data();
                setLastMessage(newMessage);
            }
        }));
        
        const userConversationsRef = collection(db, 'conversations');
        const userConversationsQuery = query(userConversationsRef, where('participantIds', 'array-contains', currentUser.uid));
        
        unsubscribes.push(onSnapshot(userConversationsQuery, (conversationsSnapshot) => {
            conversationsSnapshot.forEach((convDoc) => {
                const messagesRef = collection(db, 'conversations', convDoc.id, 'messages');
                const messagesQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
                
                unsubscribes.push(onSnapshot(messagesQuery, (messagesSnapshot) => {
                    if (!messagesSnapshot.empty) {
                        const newMessage = messagesSnapshot.docs[0].data();
                        setLastMessage(newMessage);
                    }
                }));
            });
        }));
    
        return () => {
            unsubscribes.forEach(unsubscribe => unsubscribe());
        };
    }, [currentUser]);
    

    return (
        <NotificationContext.Provider value={{ lastMessage, isSoundEnabled, setIsSoundEnabled }}>
            {children}
        </NotificationContext.Provider>
    );
};
