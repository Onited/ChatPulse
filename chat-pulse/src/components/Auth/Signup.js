import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../Utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setSuccessMessage('Compte créé avec succès. Redirection en cours...');
            setTimeout(() => navigate('/chat'), 2000); // Redirige après 3 secondes
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
