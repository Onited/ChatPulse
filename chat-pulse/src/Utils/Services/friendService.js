import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, getDoc, onSnapshot } from 'firebase/firestore';

export const listenForFriendRequests = (userId, setRequests) => {
    const q = query(collection(db, 'friendRequests'), where('to', '==', userId), where('status', '==', 'pending'));
    return onSnapshot(q, (snapshot) => {
        const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setRequests(requests);
    });
};


export const acceptFriendRequest = async (requestId) => {
    const requestDoc = doc(db, 'friendRequests', requestId);
    await updateDoc(requestDoc, {
        status: 'accepted',
    });
};


export const declineFriendRequest = async (requestId) => {
    const requestDoc = doc(db, 'friendRequests', requestId);
    await updateDoc(requestDoc, {
        status: 'declined',
    });
};


export const getFriendRequests = async (userId) => {
    const requests = [];
    const q = query(collection(db, 'friendRequests'), where('to', '==', userId), where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        requests.push({ id: doc.id, ...doc.data() });
    });
    return requests;
};

export const listenForFriends = (userId, setFriends) => {
    const dbRef = collection(db, 'friendRequests');

    const handleSnapshot = async (snapshot) => {
        const newFriends = [];
        for (const docSnapshot of snapshot.docs) {
            const friendId = docSnapshot.data().from === userId ? docSnapshot.data().to : docSnapshot.data().from;
            const friendDocRef = doc(db, 'users', friendId);
            const friendDoc = await getDoc(friendDocRef);
            if (friendDoc.exists()) {
                newFriends.push({ id: friendId, pseudo: friendDoc.data().pseudo });
            }
        }
        setFriends(prevFriends => {
            // Fusionner avec les amis précédents en évitant les doublons
            const mergedFriends = [...prevFriends, ...newFriends];
            return mergedFriends.filter((friend, index, self) =>
                index === self.findIndex(f => f.id === friend.id)
            );
        });
    };

    const sentRequests = query(dbRef, where('from', '==', userId), where('status', '==', 'accepted'));
    const unsubscribeSent = onSnapshot(sentRequests, handleSnapshot);

    const receivedRequests = query(dbRef, where('to', '==', userId), where('status', '==', 'accepted'));
    const unsubscribeReceived = onSnapshot(receivedRequests, handleSnapshot);

    return () => {
        unsubscribeSent();
        unsubscribeReceived();
    };
};




const friendRequestExists = async (fromUserId, toUserId) => {
    const q = query(collection(db, 'friendRequests'), 
        where('from', '==', fromUserId),
        where('to', '==', toUserId));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

// Envoyer une demande d'ami
export const sendFriendRequest = async (fromUserId, toUserId) => {
    if (await friendRequestExists(fromUserId, toUserId)) {
        console.log("Une demande d'ami existe déjà entre ces utilisateurs.");
        return; 
    }else if (await friendRequestExists(toUserId, fromUserId)) {
        console.log("Une demande d'ami existe déjà entre ces utilisateurs.");
        return;
    } else if (fromUserId === toUserId) {
        console.log("Vous ne pouvez pas vous envoyer une demande d'ami.");
        return;
    } else if (fromUserId === '' || toUserId === '') {
        console.log("L'ID de l'utilisateur ne peut pas être vide.");
        return;
    }

    // Ajouter la nouvelle demande d'ami dans Firestore
    await addDoc(collection(db, 'friendRequests'), {
        from: fromUserId,
        to: toUserId,
        status: 'pending',
    });
};

export const startOrGetPrivateConversation = async (userId1, userId2) => {
    const q = query(
        collection(db, 'conversations'),
        where('participantIds', 'array-contains', userId1)
    );

    const querySnapshot = await getDocs(q);
    let existingConversation = querySnapshot.docs.find(doc => doc.data().participantIds.includes(userId2));

    if (existingConversation) {
        return existingConversation.id;
    }

    const newConversationRef = await addDoc(collection(db, 'conversations'), {
        participantIds: [userId1, userId2],
        lastActivity: new Date()
    });

    return newConversationRef.id;
};