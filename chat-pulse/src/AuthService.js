import { auth } from './Utils/firebaseConfig';

const signUp = async (email, password) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    console.log('Utilisateur créé avec succès:', userCredential.user);
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur:', error.message);
  }
};

const signIn = async (email, password) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log('Connexion réussie:', userCredential.user);
  } catch (error) {
    console.error('Erreur de connexion:', error.message);
  }
};

const signOut = async () => {
  try {
    await auth.signOut();
    console.log('Déconnexion réussie');
  } catch (error) {
    console.error('Erreur de déconnexion:', error.message);
  }
};