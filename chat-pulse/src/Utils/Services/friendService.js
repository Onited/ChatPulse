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
    // Mettre à jour la liste d'amis des deux utilisateurs
    const userDocRef = doc(db, 'users', userId);
    const friendDocRef = doc(db, 'users', fromUserId);

    await updateDoc(userDocRef, {
        friendIds: arrayUnion(fromUserId),
        friendRequestsPending: arrayRemove(fromUserId)
    });

    await updateDoc(friendDocRef, {
        friendIds: arrayUnion(userId)
    });

    // Supprimez la demande d'ami de la collection friendRequests si nécessaire
};

export const declineFriendRequest = async (fromUserId, userId) => {
    // Simplement retirer l'ID de l'utilisateur émetteur de la liste d'attente d'amis de l'utilisateur destinataire
    const userToRef = doc(db, 'users', userId);
    await updateDoc(userToRef, {
        friendRequestsPending: arrayRemove(fromUserId)
    });

    // Supprimez la demande d'ami de la collection friendRequests si nécessaire
};

// export const getFriendRequests = async (userId) => {
//     const requests = [];
//     const q = query(collection(db, 'friendRequests'), where('to', '==', userId), where('status', '==', 'pending'));
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//         requests.push({ id: doc.id, ...doc.data() });
//     });
//     return requests;
// };

// export const listenForFriends = (userId, setFriends) => {
//     const userDocRef = doc(db, 'users', userId);

//     return onSnapshot(userDocRef, async (docSnapshot) => {
//         const userData = docSnapshot.data();
//         if (userData && userData.friendIds) {
//             // Créez un tableau de promesses pour récupérer les documents d'amis
//             const friendPromises = userData.friendIds.map(friendId => getDoc(doc(db, 'users', friendId)));

//             // Attendez que toutes les promesses soient résolues
//             const friendDocs = await Promise.all(friendPromises);

//             // Mappez sur les documents résolus pour créer le tableau d'amis
//             const newFriends = friendDocs.map(docSnapshot => ({
//                 id: docSnapshot.id,
//                 ...docSnapshot.data()
//             }));
//             setFriends(newFriends);
//         }
//     });
// };

export const listenForFriends = (userId, setFriends) => {
    const userDocRef = doc(db, 'users', userId);

    return onSnapshot(userDocRef, async (docSnapshot) => {
        const userData = docSnapshot.data();
        if (userData && userData.friendIds && userData.friendIds.length > 0) {
            const friendsQuery = query(collection(db, 'users'), where('__name__', 'in', userData.friendIds));
            const querySnapshot = await getDocs(friendsQuery);
            const friends = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFriends(friends);
        } else {
            setFriends([]);
        }
    });
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
    // Vérifiez d'abord si une demande d'ami existe déjà
    if (await friendRequestExists(fromUserId, toUserId)) {
        console.log("Une demande d'ami existe déjà entre ces utilisateurs.");
        return;
    }

    // Ajouter l'ID de l'utilisateur émetteur dans la liste d'attente d'amis de l'utilisateur destinataire
    const userToRef = doc(db, 'users', toUserId);
    await updateDoc(userToRef, {
        friendRequestsPending: arrayUnion(fromUserId)
    });

    // Optionnel: Ajouter l'ID de l'utilisateur destinataire dans la liste des demandes d'amis envoyées de l'utilisateur émetteur
    const userFromRef = doc(db, 'users', fromUserId);
    await updateDoc(userFromRef, {
        friendRequestsSent: arrayUnion(toUserId)
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