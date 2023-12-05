// import React, { useState } from 'react';
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from '../../Utils/firebaseConfig';
// import { useNavigate } from 'react-router-dom';

// function Signup() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     const navigate = useNavigate();

//     const handleSignup = async (e) => {
//         e.preventDefault();
//         try {
//             await createUserWithEmailAndPassword(auth, email, password);
//             setSuccessMessage('Compte créé avec succès. Redirection en cours...');
//             setTimeout(() => navigate('/chat'), 2000); // Redirige après 3 secondes
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     const goToHome = () => {
//         navigate('/home');
//     };

//     return (
//         <div>
//             <form onSubmit={handleSignup}>
//                 <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Email"
//                 />
//                 <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Mot de passe"
//                 />
//                 <button type="submit">S'inscrire</button>
//             </form>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
//             <button onClick={goToHome}>Retour à l'accueil</button>
//         </div>
//     );
// }

// export default Signup;


import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../../Utils/firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pseudo, setPseudo] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Vérifier que le pseudo est unique
        const pseudoRef = doc(db, 'pseudos', pseudo);
        const pseudoSnap = await getDoc(pseudoRef);
        if (pseudoSnap.exists() || !pseudo.trim()) {
            setError('Le pseudo est déjà utilisé ou invalide.');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Mise à jour du profil utilisateur avec le pseudo
            await updateProfile(user, {
                displayName: `@${pseudo}`,
            });

            // Enregistrer le pseudo dans Firestore pour garantir l'unicité
            await setDoc(pseudoRef, { uid: user.uid });

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
