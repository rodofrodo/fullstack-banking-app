import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function P2PTransferWidget({ onUserSelected }) {
    // vars
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // here will be our receiver

    // this triggers when the entered text changes
    useEffect(() => {
        // if less than two then we skip
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        // debouncing: 300 ms
        const delayDebounceFn = setTimeout(async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get(`http://localhost:8080/api/p2p/search?query=${searchQuery}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error('User search error:', error);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // default avatar
    const defaultAvatar = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80";

    return (
        <div className="p2p-search-container" style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <label>Send money to a friend:</label>
    
            {/* Selected user or search input */}
            {selectedUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <img src={ selectedUser.avatar || defaultAvatar } alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 'bold' }}>{ selectedUser.username }</span>
                    <button onClick={() => {
                        setSelectedUser(null)
                        onUserSelected(null)  // Notify parent component that no user is selected
                        }} style={{ marginLeft: 'auto', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                </div>
            ) : (
                <input 
                    type="text"
                    placeholder="Enter username" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px' }}
                />
            )}

            { searchResults.length > 0 && !selectedUser && (
                <ul style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: '1px solid #ccc', listStyle: 'none', padding: 0, margin: 0, zIndex: 10 }}>
                    { searchResults.map((user, index) => (
                        <li 
                            key={index} 
                            onClick={() => {
                                setSelectedUser(user);
                                onUserSelected(user);  // Notify parent component of the selected user
                                setSearchQuery('');
                                setSearchResults([]);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                        >
                            <img src={user.avatar || defaultAvatar} alt="Avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                            {user.username}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
