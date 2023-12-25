import React, { useState } from 'react';
import { db } from '../../Utils/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { sendFriendRequest } from '../../Utils/Services/friendService'; // Assurez-vous que cette fonction existe

const UserSearch = ({ currentUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('pseudo', '==', searchTerm));
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        setSearchResults(users);
    };

    const handleSendRequest = async (userId) => {
        await sendFriendRequest(currentUserId, userId);
        // Afficher un message de confirmation ou mettre à jour l'interface utilisateur
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un utilisateur"
            />
            <button onClick={handleSearch}>Rechercher</button>
            <ul>
                {searchResults.map((user) => (
                    <li key={user.id}>
                        {user.pseudo}
                        <button onClick={() => handleSendRequest(user.id)}>Envoyer une demande d'ami</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserSearch;
