import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, getDoc, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';


export const listenForFriendRequests = (userId, setRequests) => {
    const userDocRef = doc(db, 'users', userId);

    return onSnapshot(userDocRef, (docSnapshot) => {
        const userData = docSnapshot.data();
        if (userData && userData.friendRequestsPending) {
            setRequests(userData.friendRequestsPending.map(friendId => ({ id: friendId })));
        }
    });
};

export const acceptFriendRequest = async (fromUserId, userId) => {
    const userDocRef = doc(db, 'users', userId);
    const friendDocRef = doc(db, 'users', fromUserId);

    await updateDoc(userDocRef, {
        friendIds: arrayUnion(fromUserId),
        friendRequestsPending: arrayRemove(fromUserId)
    });

    await updateDoc(friendDocRef, {
        friendIds: arrayUnion(userId)
    });

};

export const declineFriendRequest = async (fromUserId, userId) => {
    const userToRef = doc(db, 'users', userId);
    await updateDoc(userToRef, {
        friendRequestsPending: arrayRemove(fromUserId)
    });

};


export const listenForFriends = (userId, setFriends) => {
    const userDocRef = doc(db, 'users', userId);
    let unsubscribes = [];

    onSnapshot(userDocRef, async (docSnapshot) => {
        const userData = docSnapshot.data();
        if (userData && userData.friendIds) {
            // Annuler toutes les écoutes précédentes
            unsubscribes.forEach(unsubscribe => unsubscribe());
            unsubscribes = [];

            // Récupérer et écouter les modifications de chaque ami
            userData.friendIds.forEach(friendId => {
                const friendRef = doc(db, 'users', friendId);
                const unsubscribe = onSnapshot(friendRef, (friendDoc) => {
                    setFriends(prevFriends => {
                        const newFriends = [...prevFriends.filter(f => f.id !== friendId), { id: friendDoc.id, ...friendDoc.data() }];
                        return newFriends;
                    });
                });
                unsubscribes.push(unsubscribe);
            });
        }
    });

    return () => {
        unsubscribes.forEach(unsubscribe => unsubscribe());
    };
};


const friendRequestExists = async (fromUserId, toUserId) => {
    const userToRef = doc(db, 'users', toUserId);
    const userToDoc = await getDoc(userToRef);

    if (userToDoc.exists()) {
        const userData = userToDoc.data();
        return userData.friendRequestsPending && userData.friendRequestsPending.includes(fromUserId);
    }

    return false;
};

export const sendFriendRequest = async (fromUserId, toUserId) => {
    if (fromUserId === toUserId) {
        console.log("Vous ne pouvez pas vous envoyer une demande d'ami à vous-même.");
        return;
    }

    const fromUserRef = doc(db, 'users', fromUserId);
    const fromUserDoc = await getDoc(fromUserRef);

    if (fromUserDoc.exists() && fromUserDoc.data().friendIds && fromUserDoc.data().friendIds.includes(toUserId)) {
        console.log("Cette personne est déjà votre ami.");
        return;
    }

    if (await friendRequestExists(fromUserId, toUserId)) {
        console.log("Une demande d'ami existe déjà entre ces utilisateurs.");
        return;
    }

    await addDoc(collection(db, 'friendRequests'), {
        from: fromUserId,
        to: toUserId,
        status: 'pending',
    });

    const userToRef = doc(db, 'users', toUserId);
    await updateDoc(userToRef, {
        friendRequestsPending: arrayUnion(fromUserId)
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