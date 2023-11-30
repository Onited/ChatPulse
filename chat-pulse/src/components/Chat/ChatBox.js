import React from 'react';
import MessageInput from './MessageInput';
import Message from './Message';
// Importe le hook ou le service pour communiquer avec Firebase

const ChatBox = () => {
  // Logique de chat ici
  return (
    <div>
      <MessageInput />
      {/* Ici, tu afficherais les messages en mappant sur l'état qui les contient */}
    </div>
  );
};

export default ChatBox;