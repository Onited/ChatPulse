import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, getDoc, onSnapshot } from 'firebase/firestore';

const friendRequestExists = async (fromUserId, toUserId) => {
    const q = query(collection(db, 'friendRequests'), 
        where('from', '==', fromUserId),
        where('to', '==', toUserId));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

export const sendFriendRequest = async (fromUserId, toUserId) => {
    if (await friendRequestExists(fromUserId, toUserId)) {
        console.log("Une demande d'ami existe déjà entre ces utilisateurs.");
        return; // Stopper la fonction si une demande existe déjà
    }

    // Ajouter la nouvelle demande d'ami dans Firestore
    await addDoc(collection(db, 'friendRequests'), {
        from: fromUserId,
        to: toUserId,
        status: 'pending',
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

// export const getFriends = async (userId) => {
//     const friends = [];
//     const dbRef = collection(db, 'friendRequests');

//     const sentRequests = query(dbRef, where('from', '==', userId), where('status', '==', 'accepted'));
//     const sentSnapshot = await getDocs(sentRequests);
//     for (const docSnapshot of sentSnapshot.docs) {
//         const friendId = docSnapshot.data().to;
//         const friendDocRef = doc(db, 'users', friendId);
//         const friendDoc = await getDoc(friendDocRef);
//         if (friendDoc.exists()) {
//             friends.push({ id: friendId, pseudo: friendDoc.data().pseudo });
//         }
//     }

//     const receivedRequests = query(dbRef, where('to', '==', userId), where('status', '==', 'accepted'));
//     const receivedSnapshot = await getDocs(receivedRequests);
//     for (const docSnapshot of receivedSnapshot.docs) {
//         const friendId = docSnapshot.data().from;
//         const friendDocRef = doc(db, 'users', friendId);
//         const friendDoc = await getDoc(friendDocRef);
//         if (friendDoc.exists()) {
//             friends.push({ id: friendId, pseudo: friendDoc.data().pseudo });
//         }
//     }

//     return friends;
// };

export const listenForFriends = (userId, setFriends) => {
    const dbRef = collection(db, 'friendRequests');

    const handleSnapshot = async (snapshot) => {
        const friends = [];
        for (const docSnapshot of snapshot.docs) {
            const friendId = docSnapshot.data().from === userId ? docSnapshot.data().to : docSnapshot.data().from;
            const friendDocRef = doc(db, 'users', friendId);
            const friendDoc = await getDoc(friendDocRef);

            if (friendDoc.exists()) {
                friends.push({ id: friendId, pseudo: friendDoc.data().pseudo });
            }
        }
        setFriends(friends);
    };

    const sentRequests = query(dbRef, where('from', '==', userId), where('status', '==', 'accepted'));
    const receivedRequests = query(dbRef, where('to', '==', userId), where('status', '==', 'accepted'));

    const unsubscribeSent = onSnapshot(sentRequests, handleSnapshot);
    const unsubscribeReceived = onSnapshot(receivedRequests, handleSnapshot);

    // Retourner une fonction pour annuler l'écoute
    return () => {
        unsubscribeSent();
        unsubscribeReceived();
    };
};
