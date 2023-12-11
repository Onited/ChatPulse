import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import FriendRequests from '../Friends/FriendRequests';
import UserSearch from '../Friends/UserSearch';
import ChatBox from '../Chat/ChatBox';
import { useAuth } from '../../Utils/AuthContext';
import './css/HomePage.css';

const FriendsPage = () => {
    const { currentUser } = useAuth();
    const [currentComponent, setCurrentComponent] = useState('chatBox');
    
    return (
        <div className="home-page">
            <Sidebar switchComponent={setCurrentComponent} />
            <div className='home-container'>
                {currentComponent === 'chatBox' && <ChatBox />}
                {currentComponent === 'userSearch' && <UserSearch currentUserId={currentUser.uid} />}
                {currentComponent === 'friendRequests' && <FriendRequests userId={currentUser.uid} />}
            </div>
        </div>
    );
};

export default FriendsPage;
