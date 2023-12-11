import React, { useEffect, useState } from 'react';
import { getFriendRequests, acceptFriendRequest, declineFriendRequest } from '../../Utils/Services/friendService';

const FriendRequests = ({ userId }) => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const fetchedRequests = await getFriendRequests(userId);
            setRequests(fetchedRequests);
        };

        fetchRequests();
    }, [userId]);

    const handleAccept = async (requestId) => {
        await acceptFriendRequest(requestId);
    };

    const handleDecline = async (requestId) => {
        await declineFriendRequest(requestId);
    };

    return (
        <div>
            {requests.map(request => (
                <div key={request.id}>
                    <p>Demande de {request.from}</p>
                    <button onClick={() => handleAccept(request.id)}>Accepter</button>
                    <button onClick={() => handleDecline(request.id)}>Refuser</button>
                </div>
            ))}
        </div>
    );
};

export default FriendRequests;
