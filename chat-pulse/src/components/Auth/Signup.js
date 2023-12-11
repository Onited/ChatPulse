import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../../Utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Utils/AuthContext';
import { useTheme } from '../../Utils/ThemeContext';
import './css/Auth.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { setCurrentUser } = useAuth();
    const { darkMode } = useTheme();

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
            setTimeout(() => navigate('/home'), 2000);
        } catch (err) {
            setError(err.message);
        }
    };
    if (darkMode) {
        return (
            <div className='container'>
                <div className='form-container dark-mode-form'>
                <h1>Signup</h1>
                    <form onSubmit={handleSignup}>
                        <label htmlFor="pseudo">Pseudo: </label>
                        <input
                            type="text"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            placeholder="Pseudo"
                            className='dark-mode-input'
                        />
                        <label htmlFor="email">Email: </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className='dark-mode-input'
                        />
                        <label htmlFor="password">Mot de passe: </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mot de passe"
                            className='dark-mode-input'
                        />
                        <button type="submit">S'inscrire</button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    <p>You already have an account ? <a href='/login'>Login</a> or <a href='/home'>go home</a></p>
                </div>
            </div>
        );
    }else {
        return (
            <div className='container'>
                <div className='form-container light-mode-form'>
                    <h1>Signup</h1>
                    <form onSubmit={handleSignup}>
                        <label htmlFor="pseudo">Pseudo: </label>
                        <input
                            type="text"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            placeholder="Pseudo"
                        />
                        <label htmlFor="email">Email: </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                        <label htmlFor="password">Mot de passe: </label>
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
                    <p>You already have an account ? <a href='/login'>Login</a> or <a href='/'>go home</a></p>
                </div>
            </div>
        );
    }
}

export default Signup;
