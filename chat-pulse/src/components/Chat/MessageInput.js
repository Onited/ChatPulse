import React, { useState } from 'react';
import { Editor, EditorState, ContentState } from 'draft-js';
import { db } from '../../Utils/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../Utils/AuthContext';
import { useTheme } from '../../Utils/ThemeContext';
import GiphySearch from '../Gifs/GiphySearch';
import './css/MessageInput.css';
import 'draft-js/dist/Draft.css';

const MessageInput = ({ onSendMessage, conversationId }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const { currentUser } = useAuth();
    const { darkMode } = useTheme();
    const [isGifModalOpen, setIsGifModalOpen] = useState(false);

    const send = async (text, gifUrl) => {
        let messageContent = text;

        if (gifUrl) {
            messageContent = gifUrl;
        } else {
            const currentContent = editorState.getCurrentContent();
            messageContent = currentContent.getPlainText();
            if (!messageContent.trim()) return;
        }

        const messageData = {
            text: messageContent,
            uid: currentUser.uid,
            pseudo: currentUser.displayName,
            timestamp: serverTimestamp(),
        };

        if (onSendMessage) {
            onSendMessage(messageContent, gifUrl);
        } else {
            await addDoc(collection(db, 'conversations', 'global', 'messages'), messageData);
        }

        if (!gifUrl) {
            const emptyContentState = ContentState.createFromText('');
            const newEditorState = EditorState.push(editorState, emptyContentState, 'remove-range');
            const movedFocusEditorState = EditorState.moveFocusToEnd(newEditorState);
            setEditorState(movedFocusEditorState);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        send();
    };

    const handleReturn = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
            return 'handled';
        }
        return 'not-handled';
    };

    const handleGifSelect = (gif) => {
        send(null, gif.images.fixed_height.url);
        setIsGifModalOpen(false);
    };

    const footerStyle = `footer-container ${darkMode ? 'dark-mode-footer' : 'light-mode-footer'}`;
    const inputStyle = `message-input ${darkMode ? 'dark-mode-input' : 'light-mode-input'}`;

    return (
        <div className={footerStyle}>
            {isGifModalOpen && (
                <div className="modal">
                    <GiphySearch onSelect={handleGifSelect} />
                    <button onClick={() => setIsGifModalOpen(false)}>Fermer</button>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className={inputStyle}>
                    <Editor
                        editorState={editorState}
                        onChange={setEditorState}
                        handleReturn={handleReturn}
                        placeholder="Type a message..."
                    />
                </div>
                <button type="button" onClick={() => setIsGifModalOpen(true)}>Ajouter GIF</button>
            </form>
        </div>
    );
};

export default MessageInput;
