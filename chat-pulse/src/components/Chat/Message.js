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

    const isGif = (text) => {
        return text.includes('giphy.com/media/');
    };    

    const isYoutube = (text) => {
        return text.includes('www.youtube.com/watch');
    };    

    const renderMessageContent = () => {
        if (message.gifUrl) {
            return <img src={message.gifUrl} alt="GIF" style={{ maxWidth: '100%' }} />;
        }

        const text = message.text;
        if (text) {
            if (isGif(text)) {
                return <img src={text} alt="GIF" style={{ maxWidth: '100%' }} />;
            } else if (isYoutube(text)) {
                const videoId = text.split('v=')[1];
                return (
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        allowFullScreen
                    />
                );
            } else {
                return formatMessage(text);
            }
        }

        return null;
    };

    const formatMessage = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                <Linkify componentDecorator={linkDecorator}>{line}</Linkify>
                <br/>
            </React.Fragment>
        ));
    };

    return (
        <div ref={ref} className={`message ${darkMode ? 'dark-mode-messages' : 'light-mode-messages'} ${isOwnMessage ? 'own' : ''}`}>
            <p className='bolder'>{message.pseudo}:</p>
            {renderMessageContent(message.text)}
        </div>
    );
    
});

export default Message;
