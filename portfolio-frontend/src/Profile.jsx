import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Import the CSS file for styling
import axios from 'axios';

export default function Profile() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // state for user profile data
    const [profile, setProfile] = useState({
        username: 'Loading...',
        email: 'Loading...',
        avatarUrl: ''
    });

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get('http://localhost:8080/api/profile/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        // we remove the token and log out the user
        localStorage.removeItem('jwt_token');
        navigate('/');
        window.location.reload(); // to clear App.jsx states
    };

    // image conversion to base64
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64String = reader.result;

                // updating the image
                setProfile(prev => ({ ...prev, avatar: base64String }));

                try {
                    const token = localStorage.getItem('jwt_token');
                    await axios.post('http://localhost:8080/api/profile/avatar',
                        { avatar: base64String },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    console.log('Image saved in the database!');
                } catch (error) {
                    console.error('Error while loading the image:', error);
                    alert('Could not save the image.');
                }
            };

            reader.readAsDataURL(file);
        }
    };

    // default avatar
    const defaultAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80";

    return (
        <div className='profile-page'>
            {/* HEADER */}
            <div className='profile-header'>
                <div className='profile-logo'>Ancient Bank</div>
                <div className="profile-right-menu">
                    <button onClick={handleLogout} className="logout-btn">Log Out</button>
                </div>
            </div>

            {/* BODY */}
            <div className='profile-body'>
                <aside className='profile-sidebar'>
                    {[...Array(8)].map((_, index) => (
                        <button key={index} className='sidebar-btn'>
                            PRZYCISK 1
                        </button>
                    ))}
                </aside>

                <main className='profile-main'>
                    <div className='profile-card'>
                        {/* CHOOSING A FILE */}
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            onChange={handleAvatarChange} 
                        />

                        {/* clicking an image causes the imput dialogue to launch */}
                        <div 
                            style={{ position: 'relative', cursor: 'pointer' }}
                            onClick={() => fileInputRef.current.click()}
                            title="Click to change the photo"
                        >
                            <img 
                                src={profile.avatar ? profile.avatar : defaultAvatar} 
                                alt="Avatar" 
                                className="profile-avatar" 
                            />
                        </div>

                        <h2 className='profile-name'>{profile.username}</h2>
                        <p className='profile-email'>{profile.email}</p>
                    </div>
                </main>
            </div>
        </div>
    );
};
