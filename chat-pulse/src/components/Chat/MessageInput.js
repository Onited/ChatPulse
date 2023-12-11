import React, { useState } from 'react';
import { Editor, EditorState, ContentState } from 'draft-js';
import { db } from '../../Utils/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../Utils/AuthContext';
import { useTheme } from '../../Utils/ThemeContext';
import './css/MessageInput.css';
import 'draft-js/dist/Draft.css';

const MessageInput = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const { currentUser } = useAuth();
    const { darkMode } = useTheme();

    const sendMessage = async () => {
        const currentContent = editorState.getCurrentContent();
        const text = currentContent.getPlainText();
    
        if (!text.trim()) return;
    
        await addDoc(collection(db, 'messages'), {
            text: text,
            uid: currentUser.uid,
            pseudo: currentUser.displayName,
            timestamp: serverTimestamp(),
        });
    
        const emptyContentState = ContentState.createFromText('');
        const newEditorState = EditorState.push(editorState, emptyContentState, 'remove-range');
        const movedFocusEditorState = EditorState.moveFocusToEnd(newEditorState);
    
        setEditorState(movedFocusEditorState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage();
    };

    const handleReturn = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            return 'handled';
        }
        return 'not-handled';
    };

    const className = `footer-container ${darkMode ? 'dark-mode-footer' : 'light-mode-footer'}`;
    if (darkMode){
        return (
            <div className={className}>
                <form onSubmit={handleSubmit}>
                    <div className="message-input dark-mode-input">
                        <Editor
                            editorState={editorState}
                            onChange={setEditorState}
                            handleReturn={handleReturn}
                            placeholder="Type a message..."
                        />
                    </div>
                </form>
            </div>
        );
    }else{
        return (
            <div className={className}>
                <form onSubmit={handleSubmit}>
                    <div className="message-input light-mode-input">
                        <Editor
                            editorState={editorState}
                            onChange={setEditorState}
                            handleReturn={handleReturn}
                            placeholder="Type a message..."
                        />
                    </div>
                </form>
            </div>
        );
    }
};

export default MessageInput;