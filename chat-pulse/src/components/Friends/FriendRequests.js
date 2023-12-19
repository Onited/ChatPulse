import React, { useEffect, useState } from 'react';
import { listenForFriendRequests, acceptFriendRequest, declineFriendRequest } from '../../Utils/Services/friendService';

const FriendRequests = ({ userId }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const unsubscribe = listenForFriendRequests(userId, setRequests);
        return () => unsubscribe();
    }, [userId]);

    const handleAccept = async (fromUserId) => {
        await acceptFriendRequest(fromUserId, userId); // Mise à jour pour la nouvelle logique
    };

    const handleDecline = async (fromUserId) => {
        await declineFriendRequest(fromUserId, userId); // Mise à jour pour la nouvelle logique
    };

    return (
        <div>
            {requests.map(request => (
                <div key={request.id}>
                    <p>Demande de {request.id}</p> {/* Ici 'request.id' est l'ID de l'utilisateur qui a envoyé la demande */}
                    <button onClick={() => handleAccept(request.id)}>Accepter</button>
                    <button onClick={() => handleDecline(request.id)}>Refuser</button>
                </div>
            ))}
        </div>
    );
};

export default FriendRequests;
