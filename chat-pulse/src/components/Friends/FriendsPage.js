import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import FriendRequests from './FriendRequests';
import UserSearch from './UserSearch';
import { useAuth } from '../../Utils/AuthContext';
import './css/FriendsPage.css';

const FriendsPage = () => {
    const { currentUser } = useAuth();
    const [currentComponent, setCurrentComponent] = useState('A');
    
    return (
        <div className="friends-page">
            <Sidebar switchComponent={setCurrentComponent} />
            <div className='friends-container'>
                {currentComponent === 'A' ? <UserSearch currentUserId={currentUser.uid} /> : <FriendRequests userId={currentUser.uid} />}
            </div>
        </div>
    );
};

export default FriendsPage;
