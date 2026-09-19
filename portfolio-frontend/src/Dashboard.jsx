import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { formatAccountNumber, formatBalance } from './global/utils';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [accountMessage, setAccountMessage] = useState('');
    const navigate = useNavigate();

    // new states
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const fetchAccounts = async () => {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;

        try {
            const response = await axios.get(
                'http://localhost:8080/api/accounts/my',
                { headers: { Authorization: 'Bearer ' + token } }
            );
            setAccounts(response.data);

            // we choose the first account automatically
            if (response.data.length > 0)
                setSelectedAccount(response.data[0]);
        } catch (error) {
            console.error("Cannot download the accounts: ", error);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const hasAnyCard = accounts.some(acc => acc.paymentCard != null);

    const getAccountTypeName = (type) => {
        switch (type) {
            case 'PERSONAL': return 'Personal Account';
            case 'BUSINESS': return 'Business Account';
            case 'POCKET': return 'Pocket Account';
            case 'SAVINGS': return 'Savings Account';
            case 'BONDS': return 'Bonds Account';
            default: return 'Standard Account';
        };
    };

    // --- Logika przesuwania myszką ---
    const handleMouseDown = (e) => {
        setIsDragging(false); // Resetujemy flagę przeciągania
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e) => {
        // e.buttons === 1 oznacza, że lewy przycisk myszy jest wciśnięty
        if (e.buttons !== 1) return; 
        
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = x - startX;
        
        // Jeśli myszka przesunęła się o więcej niż 5px, traktujemy to jako przeciąganie, a nie kliknięcie
        if (Math.abs(walk) > 5) {
            setIsDragging(true);
        }
        
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleCardClick = (acc) => {
        // Blokujemy nawigację, jeśli użytkownik tylko przesuwał karuzelę
        if (isDragging) return;
        navigate(`/u/account/${acc.id}`, { state: { account: acc } });
    };

    return (
        <div style={{ maxWidth: '1300px', margin: '20px auto', fontFamily: 'sans-serif' }}>
            
            {/* Wstrzykujemy CSS ukrywający systemowy pasek przewijania */}
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            <div style={{ backgroundColor: '#e2f0fe', borderRadius: '22px', padding: '25px 25px 15px 25px' }}>
                <h2 style={{ margin: '0 0 20px 0', fontSize: '22px', color: '#000', fontWeight: 'bold', fontFamily: 'Inter' }}>
                    Bank accounts
                </h2>

                {/* Kontener karuzeli z podpiętą referencją i eventami myszy */}
                <div 
                    ref={scrollRef}
                    className="hide-scrollbar"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        overflowX: 'auto', 
                        paddingBottom: '10px',
                        cursor: 'grab',
                        userSelect: 'none' // Zapobiega zaznaczaniu tekstu podczas przeciągania
                    }}
                >
                    {accounts.map((acc, index) => {
                        const mainWallet = acc.wallets && acc.wallets.length > 0 ? acc.wallets[0] : { balance: 0, currency: 'PLN' };
                        
                        const gradients = [
                            'linear-gradient(135deg, #cde4fa, #a5d2fc)', 
                            'linear-gradient(135deg, #e4cbf8, #c1aef7)', 
                            'linear-gradient(135deg, #cbf8eb, #a5fce4)'
                        ];
                        const bg = gradients[index % gradients.length];

                        return (
                            <div 
                                key={acc.id} 
                                onClick={() => handleCardClick(acc)}
                                style={{ 
                                    width: '455px', 
                                    flexShrink: 0,
                                    height: '245px',
                                    padding: '20px', 
                                    borderRadius: '12px', 
                                    background: bg,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '24px', color: '#878787', marginBottom: '8px', fontFamily: 'Inter' }}>
                                        {getAccountTypeName(acc.accountType)}
                                    </div>
                                    <div style={{ fontSize: '48px', fontWeight: '900', color: '#000', letterSpacing: '-0.5px', fontFamily: 'Inter' }}>
                                        {formatBalance(mainWallet.balance)} 
                                        {` ${mainWallet.currency}`}
                                    </div>
                                </div>
                                
                                <div style={{ marginTop: '30px' }}>
                                    {acc.paymentCard ? (
                                        <div style={{ backgroundColor: '#222', color: '#fff', padding: '6px 12px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold' }}>
                                            <span style={{ color: '#ff9800' }}>●●</span>
                                            **** {acc.paymentCard.cardNumber.slice(-4)}
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: '12px', color: '#555', marginTop: '10px' }}>No card</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    <div 
                        onClick={() => { if (!isDragging) navigate('/u/create-account'); }}
                        style={{
                            width: '455px',
                            flexShrink: 0,
                            height: '245px',
                            padding: '20px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            border: '2px dashed #99c2ff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0056b3',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        <div style={{ fontSize: '36px', fontWeight: '300', marginBottom: '10px' }}>+</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Open new account</div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '15px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4a67ff' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#aebcfc' }}></div>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#aebcfc' }}></div>
                </div>
            </div>
            

            {/*
            <div style={{ border: '1px solid #ffc107', padding: '25px', borderRadius: '8px', backgroundColor: '#fffdf6', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                <h2 style={{ color: '#d39e00', marginTop: 0, textAlign: 'center', marginBottom: '25px' }}>My Accounts</h2>

                {accounts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '25px' }}>
                        {accounts.map(acc => (
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
                                        !hasAnyCard && (acc.accountType === 'PERSONAL' || acc.accountType === 'BUSINESS') && (
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
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>You don't have any accounts yet.</p>
                )}

                <button 
                    onClick={() => navigate('/u/create-account')} 
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
            */}
        </div>
    );
}

export default Dashboard;
