import { useEffect } from 'react';
import { useNotification } from './NotificationContext';
import messageReceivedSound from '../sounds/COMCell_Message 1 (ID 1111)_LS.wav';
import { useAuth } from './AuthContext';

const NotificationSound = () => {
    const { lastMessage, isSoundEnabled } = useNotification();
    const { currentUser } = useAuth();

    useEffect(() => {
        console.log("Dernier message reçu:", lastMessage);
        console.log("Notification sonore activée:", isSoundEnabled);
        if (lastMessage && isSoundEnabled && lastMessage.uid !== currentUser.uid) {
            console.log("Jouer le son de notification");
            new Audio(messageReceivedSound).play().catch(e => console.error("Erreur lors de la lecture du son:", e));

        }
    }, [lastMessage, isSoundEnabled, currentUser]);

    return null;
};

export default NotificationSound;
