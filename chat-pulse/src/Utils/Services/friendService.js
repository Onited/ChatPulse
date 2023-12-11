import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, getDoc } from 'firebase/firestore';

export const sendFriendRequest = async (fromUserId, toUserId) => {
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

export const getFriends = async (userId) => {
    const friends = [];
    const dbRef = collection(db, 'friendRequests');

    const sentRequests = query(dbRef, where('from', '==', userId), where('status', '==', 'accepted'));
    const sentSnapshot = await getDocs(sentRequests);
    for (const docSnapshot of sentSnapshot.docs) {
        const friendId = docSnapshot.data().to;
        const friendDocRef = doc(db, 'users', friendId);
        const friendDoc = await getDoc(friendDocRef);
        if (friendDoc.exists()) {
            friends.push({ id: friendId, pseudo: friendDoc.data().pseudo });
        }
    }

    const receivedRequests = query(dbRef, where('to', '==', userId), where('status', '==', 'accepted'));
    const receivedSnapshot = await getDocs(receivedRequests);
    for (const docSnapshot of receivedSnapshot.docs) {
        const friendId = docSnapshot.data().from;
        const friendDocRef = doc(db, 'users', friendId);
        const friendDoc = await getDoc(friendDocRef);
        if (friendDoc.exists()) {
            friends.push({ id: friendId, pseudo: friendDoc.data().pseudo });
        }
    }

    return friends;
};
