import React, { forwardRef } from 'react';
import { useAuth } from '../../Utils/AuthContext';
import { useTheme } from '../../Utils/ThemeContext';
import Linkify from 'react-linkify';
import './css/Messages.css';

const Message = forwardRef(({ message }, ref) => {
    const { currentUser } = useAuth();
    const { darkMode } = useTheme();
    const isOwnMessage = message.uid === currentUser?.uid;

    const linkDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    );

    const formatMessage = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                <Linkify componentDecorator={linkDecorator}>{line}</Linkify>
                <br/>
            </React.Fragment>
        ));
    };
    if (darkMode){
        return (
            <div ref={ref} className={`message dark-mode-messages ${isOwnMessage ? 'own' : ''}`}>
                <p><p className='bolder'>{message.pseudo}:</p> {formatMessage(message.text)}</p>
            </div>
        );
    }else{
        return (
            <div ref={ref} className={`message light-mode-messages ${isOwnMessage ? 'own' : ''}`}>
                <p><p className='bolder'>{message.pseudo}:</p> {formatMessage(message.text)}</p>
            </div>
        );
    }
    
});

export default Message;
