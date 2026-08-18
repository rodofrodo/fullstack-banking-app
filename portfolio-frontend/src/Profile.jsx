import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css'; // Import the CSS file for styling

export default function Profile() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // we remove the token and log out the user
        localStorage.removeItem('jwt_token');
        navigate('/');
        window.location.reload(); // to clear App.jsx states
    };

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
                        {/* TEST */}
                        <img 
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" 
                            alt="Awatar" 
                            className="profile-avatar" 
                        />
                        <h2 className='profile-name'>Cwaniak Warszawski</h2>
                        <p className='profile-email'>cwaniak.warszawski@zesrauemsie.pl</p>
                    </div>
                </main>
            </div>
        </div>
    );
};
