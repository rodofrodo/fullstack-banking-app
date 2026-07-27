import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
    // vars
    const [vaultAccounts, setVaultAccounts] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVault = async () => {
            const token = localStorage.getItem('jwt_token');
            if (!token) return;

            try {
                const response = await axios.get(
                    'http://localhost:8080/api/accounts/my',
                    { headers: { Authorization: 'Bearer ' + token } }
                );
                setVaultAccounts(response.data);
            } catch (err) {
                setError('❌ Cannot fetch treasury data.');
            }
        };
        fetchVault();
    }, []);

    return (
        <div style={{ 
            maxWidth: '800px', 
            margin: '40px auto', 
            fontFamily: 'sans-serif' 
        }}>
            <div style={{ 
                border: '2px solid #dc3545', 
                padding: '30px', 
                borderRadius: '10px', 
                backgroundColor: '#fff', 
                boxShadow: '0 8px 20px rgba(220,53,69,0.15)' 
            }}>
                <h2 style={{ color: '#dc3545', 
                    marginTop: 0, 
                    textAlign: 'center', 
                    borderBottom: '2px solid #f8d7da', 
                    paddingBottom: '20px', 
                    letterSpacing: '1px' }}>
                    🏦 Treasury
                </h2>
                
                {error && <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>{error}</p>}

                {vaultAccounts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
                        {vaultAccounts.map(acc => (
                            <div key={acc.id} style={{ 
                                padding: '30px', 
                                backgroundColor: '#212529', 
                                color: 'white', 
                                borderRadius: '10px', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' 
                            }}>
                                <div>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        color: '#adb5bd', 
                                        letterSpacing: '2px', 
                                        textTransform: 'uppercase' 
                                    }}>
                                        BANK TECHNICAL ACCOUNT
                                    </span>
                                    <strong style={{ 
                                        display: 'block', 
                                        fontSize: '20px', 
                                        letterSpacing: '2px', 
                                        marginTop: '8px', 
                                        fontFamily: 'monospace', 
                                        color: '#f8f9fa' 
                                    }}>
                                        {acc.accountNumber}
                                    </strong>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        color: '#adb5bd', 
                                        letterSpacing: '2px',
                                         textTransform: 'uppercase'
                                    }}>
                                        Share capital
                                    </span>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '10px', 
                                        flexWrap: 'wrap', 
                                        justifyContent: 'flex-end', 
                                        marginTop: '8px'
                                    }}>
                                        {acc.wallets && acc.wallets.length > 0 ? (
                                            acc.wallets.map(wallet => (
                                                <span key={wallet.currency} style={{ 
                                                    backgroundColor: '#28a745', 
                                                    color: '#fff', 
                                                    padding: '8px 15px', 
                                                    borderRadius: '6px', 
                                                    fontSize: '18px', 
                                                    fontWeight: 'bold', 
                                                    border: '1px solid #1e7e34'
                                                }}>
                                                    {wallet.balance} {wallet.currency}
                                                </span>
                                            ))
                                        ) : (
                                            <span style={{ 
                                                color: '#ffc107', 
                                                fontStyle: 'italic', 
                                                fontSize: '14px' 
                                            }}>
                                                ⚠️ The treasury is currently empty.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>Loading the treasury...</p>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
