// src/components/Chat/Message.js
// src/components/Chat/Message.js
// import React from 'react';
// import { useAuth } from '../../Utils/AuthContext'; // Assurez-vous que le chemin est correct

// const Message = ({ message }) => {
//     const { currentUser } = useAuth();
//     const isOwnMessage = message.uid === currentUser?.uid;

//     return (
//         <div className={`message ${isOwnMessage ? 'own' : ''}`}>
//             <p><strong>{message.pseudo}</strong>: {message.text}</p>
//             {/* Ajoutez ici plus de détails si nécessaire, comme l'heure ou le nom de l'utilisateur */}
//         </div>
//     );
// };

// export default Message;

import React, { forwardRef } from 'react';
import { useAuth } from '../../Utils/AuthContext';

const Message = forwardRef(({ message }, ref) => {
    const { currentUser } = useAuth();
    const isOwnMessage = message.uid === currentUser?.uid;

    return (
        <div ref={ref} className={`message ${isOwnMessage ? 'own' : ''}`}>
            <p><strong>{message.pseudo}</strong>: {message.text}</p>
        </div>
    );
});

export default Message;

