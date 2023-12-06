import React, { forwardRef } from 'react';
import { useAuth } from '../../Utils/AuthContext';

const Message = forwardRef(({ message }, ref) => {
    const { currentUser } = useAuth();
    const isOwnMessage = message.uid === currentUser?.uid;

    const formatMessage = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br/>
            </React.Fragment>
        ));
    };

    return (
        <div ref={ref} className={`message ${isOwnMessage ? 'own' : ''}`}>
            <p><strong>{message.pseudo}</strong>: {formatMessage(message.text)}</p>
        </div>
    );
});


export default Message;

