import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function OrderCard() {
    const navigate = useNavigate();
    
    // card vars
    const { accountNumber } = useParams();
    const [cardPin, setCardPin] = useState('');
    const [cardLimit, setCardLimit] = useState('1000');

    const handleOrderCard = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        if (cardPin.length !== 4 || isNaN(cardPin)) {
            alert('PIN has to contain 4 digits');
            return;
        }

        try {
            const payload = {
                accountNumber: accountNumber,
                pin: cardPin,
                dailyLimit: cardLimit
            };

            // POST request to order a card
            const response = await axios.post(
                'http://localhost:8080/api/cards/create',
                payload,
                { headers: { Authorization: 'Bearer ' + token } }
            );

            alert('The card has been ordered!');
            setShowCardModal(false);
            navigate('/u/dashboard');

        } catch (error) {
            alert('Error: ' + error);
            console.error("Error ordering a card: ", error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginTop: 0, color: '#333', textAlign: 'center' }}>Configure your card</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
                Set a PIN and a safe daily limit for account<br/>
                <strong style={{fontSize: '12px', wordBreak: 'break-all'}}>{accountNumber}</strong>
            </p>
            
            <form onSubmit={handleOrderCard} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label>
                    <strong>PIN (4 digits):</strong>
                    <input 
                        type="password" 
                        maxLength="4" 
                        value={cardPin} 
                        onChange={(e) => setCardPin(e.target.value.replace(/\D/g, ''))}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', letterSpacing: '5px', fontSize: '18px', textAlign: 'center', boxSizing: 'border-box' }}
                    />
                </label>

                <label>
                    <strong>Daily limit (PLN):</strong>
                    <input 
                        type="number" 
                        value={cardLimit} 
                        onChange={(e) => setCardLimit(e.target.value)} 
                        style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </label>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                        type="button" // Ważne: type="button" żeby nie wysyłał formularza
                        onClick={() => navigate('/u/dashboard')}
                        style={{ flex: 1, padding: '10px', backgroundColor: '#e9ecef', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" // Przycisk typu submit odpala funkcję z <form onSubmit={...}>
                        style={{ flex: 1, padding: '10px', backgroundColor: '#198754', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Order
                    </button>
                </div>
            </form>
        </div>
    );
};
