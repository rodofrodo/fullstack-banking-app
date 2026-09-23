import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { formatBalance, formatAccountNumber } from './global/utils'; // Dodany import funkcji formatAccountNumber

function AccountDetails() {
    const { id } = useParams(); 
    const location = useLocation();
    const navigate = useNavigate();

    const acc = location.state?.account;

    if (!acc) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
                <h2>No account data found</h2>
                <p>Please go back to the dashboard and select an account again.</p>
                <button 
                    onClick={() => navigate('/')} 
                    style={{ padding: '10px 20px', backgroundColor: '#0056b3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    const getAccountTypeName = (type) => {
        switch (type) {
            case 'PERSONAL': return 'Personal account';
            case 'BUSINESS': return 'Business account';
            case 'POCKET': return 'Pocket account';
            case 'SAVINGS': return 'Savings account';
            case 'BONDS': return 'Bonds account';
            default: return 'Standard account';
        };
    };

    return (
        <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            
            <button 
                onClick={() => navigate(-1)} 
                style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
            >
                ← Back
            </button>

            <div key={acc.id} style={{ padding: '20px', border: '2px solid #ffeeba', borderRadius: '8px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '15px' }}>                
                <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                    <span style={{ 
                        backgroundColor: '#004085', 
                        color: 'white', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        fontSize: '12px', 
                        fontWeight: 'bold' 
                    }}>
                        {getAccountTypeName(acc.accountType)}
                    </span>
                    
                    {acc.multiCurrency && (
                        <span style={{ 
                            backgroundColor: '#ffc107', 
                            color: '#000', 
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            fontSize: '12px', 
                            fontWeight: 'bold' 
                        }}>
                            Multi-Currency
                        </span>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ textAlign: 'left', flex: '1' }}>
                        <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Account number</span>
                        <strong style={{ fontSize: '15px', color: '#333' }}>{formatAccountNumber(acc.accountNumber)}</strong>
                    </div>
                    <div style={{ textAlign: 'right', flex: '1' }}>
                        <span style={{ display: 'block', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' }}>Balances</span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            {acc.wallets && acc.wallets.map(wallet => (
                                <span key={wallet.currency} style={{ backgroundColor: '#e9f7ef', color: '#28a745', border: '1px solid #c3e6cb', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                                    {formatBalance(wallet.balance)} {wallet.currency}
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
                        acc.paymentCard != null && (acc.accountType === 'PERSONAL' || acc.accountType === 'BUSINESS') && (
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => navigate(`/u/order-card/${acc.accountNumber}`)}
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
        </div>
    );
}

export default AccountDetails;
