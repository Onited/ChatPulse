// import React, { useState } from 'react';
// import Sidebar from '../Sidebar/Sidebar';
// import FriendRequests from '../Friends/FriendRequests';
// import UserSearch from '../Friends/UserSearch';
// import ChatBox from '../Chat/ChatBox';
// import { useAuth } from '../../Utils/AuthContext';
// import './css/HomePage.css';

// const FriendsPage = () => {
//     const { currentUser } = useAuth();
//     const [currentComponent, setCurrentComponent] = useState('chatBox');
//     const [setActiveConversation] = useState(null);
    
//     return (
//         <div className="home-page">
//             <Sidebar setActiveConversation={setActiveConversation} switchComponent={setCurrentComponent} />
//             <div className='home-container'>
//                 {currentComponent === 'chatBox' && <ChatBox />}
//                 {currentComponent === 'userSearch' && <UserSearch currentUserId={currentUser.uid} />}
//                 {currentComponent === 'friendRequests' && <FriendRequests userId={currentUser.uid} />}
//             </div>
//         </div>
//     );
// };

// export default FriendsPage;

import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import FriendRequests from '../Friends/FriendRequests';
import UserSearch from '../Friends/UserSearch';
import ChatBox from '../Chat/ChatBox';
import PrivateChatBox from '../Chat/PrivateChatBox'; // Assurez-vous d'importer PrivateChatBox
import { useAuth } from '../../Utils/AuthContext';
import './css/HomePage.css';

// Suite du composant HomePage
const HomePage = () => {
    const { currentUser } = useAuth();
    const [currentComponent, setCurrentComponent] = useState('chatBox');
    const [activeConversation, setActiveConversation] = useState(null);

    const switchComponent = (componentName, conversationId = null) => {
        setCurrentComponent(componentName);
        setActiveConversation(conversationId);
    };

    return (
        <div className="home-page">
            <Sidebar switchComponent={switchComponent} />
            <div className='home-container'>
                {currentComponent === 'chatBox' && <ChatBox />}
                {currentComponent === 'userSearch' && <UserSearch currentUserId={currentUser.uid} />}
                {currentComponent === 'friendRequests' && <FriendRequests userId={currentUser.uid} />}
                {currentComponent === 'PrivateChat' && <PrivateChatBox conversationId={activeConversation} />}
            </div>
        </div>
    );
};

export default HomePage;

