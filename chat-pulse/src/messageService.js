import { db } from './firebase';

const sendMessage = async (messageContent) => {
    try {
      await db.collection('messages').add({
        text: messageContent,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Ajoute un timestamp serveur
        // Vous pouvez ajouter d'autres données ici comme l'ID de l'utilisateur, etc.
      });
      console.log('Message envoyé');
    } catch (error) {
      console.error('Erreur lors de l’envoi du message:', error.message);
    }
  };
  const receiveMessages = () => {
    db.collection('messages').orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Messages reçus:', messages);
        // Ici, vous pouvez mettre à jour l'état de votre composant pour afficher les messages
      });
  };