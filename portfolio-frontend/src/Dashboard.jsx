import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [accountMessage, setAccountMessage] = useState('');
    const [accounts, setAccounts] = useState([]);

    const fetchAccounts = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        try {
            const response = await axios.get(
                'http://localhost:8080/api/accounts/my',
                { headers: { Authorization: 'Bearer ' + token } }
            );
            setAccounts(response.data);
        } catch (error) {
            console.error("Cannot download the accounts: ", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleCreateAccount = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            setAccountMessage('❌ No token! You need to sign in first.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/api/accounts/create',
                {},
                { headers: { Authorization: 'Bearer ' + token } }
            );
            setAccountMessage('✅ ' + response.data);
            fetchAccounts();
        } catch (error) {
            const errorMsg = error.response?.data ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)) : 'Server connection error.';
            setAccountMessage('❌ ' + errorMsg);
        }
    };

    const handleOrderCard = async (accountNumber) => {
        const token = localStorage.getItem('jwt_token');
        if (!token)
        {
            setAccountMessage('❌ No token! You need to sign in first.');
            return;
        }
        setAccountMessage(''); 

        try {
            const response = await axios.post(
                'http://localhost:8080/api/cards/create',
                { accountNumber: accountNumber },
                { headers: { Authorization: 'Bearer ' + token } }
            );

            setAccountMessage('✅ ' + response.data);
            fetchAccounts();
        } catch (error) {
            let errorMsg = 'Server connection error.';
            let statusCode = 'Unknown';
            
            if (error.response) {
                statusCode = error.response.status;
                if (typeof error.response.data === 'string' && error.response.data.trim() !== '') {
                    errorMsg = error.response.data;
                } else if (statusCode === 403) {
                    errorMsg = 'Access denied by Spring Security (403).';
                } else if (statusCode === 400) {
                    errorMsg = 'Bad Request (400) - check JSON mapping.';
                } else {
                    errorMsg = JSON.stringify(error.response.data);
                }
            }
            setAccountMessage(`❌ Error ${statusCode}: ${errorMsg}`);
        }
    };

    const hasAnyCard = accounts.some(acc => acc.paymentCard != null);

    return (
        <div style={{ maxWidth: '650px', margin: '20px auto', fontFamily: 'sans-serif' }}>
            <div style={{ border: '1px solid #ffc107', padding: '25px', borderRadius: '8px', backgroundColor: '#fffdf6', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h2 style={{ color: '#d39e00', marginTop: 0, textAlign: 'center', marginBottom: '25px' }}>My Accounts</h2>

                {accounts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px' }}>
                        {accounts.map(acc => (
                            <div key={acc.id} style={{ padding: '20px', border: '2px solid #ffeeba', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                                    <div style={{ textAlign: 'left', flex: '1' }}>
                                        <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account number</span>
                                        <strong style={{ fontSize: '15px', color: '#333' }}>{acc.accountNumber}</strong>
                                    </div>
                                    <div style={{ textAlign: 'right', flex: '1' }}>
                                        <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Balances</span>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                            {acc.wallets && acc.wallets.map(wallet => (
                                                <span key={wallet.currency} style={{ backgroundColor: '#e9f7ef', color: '#28a745', border: '1px solid #c3e6cb', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                                                    {wallet.balance} {wallet.currency}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ height: '1px', backgroundColor: '#eee', width: '100%' }}></div>

                                <div>
                                    {acc.paymentCard ? (
                                        <div style={{ backgroundColor: '#222', color: '#fff', padding: '15px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#aaa', letterSpacing: '1px', marginBottom: '8px' }}>Debit Card</div>
                                                <div style={{ fontSize: '18px', letterSpacing: '2px', fontFamily: 'monospace' }}>
                                                    **** **** **** {acc.paymentCard.cardNumber.slice(-4)}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '10px', color: '#aaa', letterSpacing: '1px' }}>EXP</div>
                                                <div style={{ fontSize: '14px', fontFamily: 'monospace' }}>{acc.paymentCard.expirationDate}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        !hasAnyCard && (
                                            <div style={{ textAlign: 'center' }}>
                                                <button 
                                                    onClick={() => handleOrderCard(acc.accountNumber)}
                                                    style={{ padding: '10px 20px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', transition: 'background-color 0.2s' }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = '#555'}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = '#333'}
                                                >
                                                    💳 Order Debit Card
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>You don't have any accounts yet.</p>
                )}

                <button 
                    onClick={handleCreateAccount} 
                    style={{ cursor: 'pointer', padding: '12px', backgroundColor: '#ffc107', color: '#333', border: 'none', borderRadius: '5px', fontWeight: 'bold', width: '100%', fontSize: '15px' }}
                >
                    ➕ Open new bank account
                </button>
                
                {accountMessage && (
                    <div style={{ marginTop: '20px', padding: '10px', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold', backgroundColor: accountMessage.includes('✅') ? '#d4edda' : '#f8d7da', color: accountMessage.includes('✅') ? '#155724' : '#721c24', border: `1px solid ${accountMessage.includes('✅') ? '#c3e6cb' : '#f5c6cb'}` }}>
                        {accountMessage}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
