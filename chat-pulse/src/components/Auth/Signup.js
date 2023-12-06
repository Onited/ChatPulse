import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../../Utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { setCurrentUser } = useAuth();

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const formattedPseudo = `@${pseudo}`;

        // Vérifier que le pseudo est unique
        const pseudoDocRef = doc(db, 'pseudos', formattedPseudo);
        const pseudoSnap = await getDoc(pseudoDocRef);
        if (pseudoSnap.exists() || !pseudo.trim()) {
            setError('Le pseudo est déjà utilisé ou invalide.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Mise à jour du profil utilisateur avec le pseudo
            await updateProfile(user, {
                displayName: formattedPseudo,
            });

            // Enregistrer le pseudo dans Firestore pour garantir l'unicité
            await setDoc(doc(db, 'users', user.uid), { pseudo: formattedPseudo, email: email });

            setCurrentUser({
                ...user,
                pseudo: formattedPseudo,
            });

            setSuccessMessage('Compte créé avec succès. Redirection en cours...');
            setTimeout(() => navigate('/chat'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    const goToHome = () => {
        navigate('/home');
    };

    return (
        <div>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    placeholder="Pseudo"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                />
                <button type="submit">S'inscrire</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <button onClick={goToHome}>Retour à l'accueil</button>
        </div>
    );
}

export default Signup;
