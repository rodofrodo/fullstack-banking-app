function Home({ navigateTo }) {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '3rem', color: '#333' }}>🏛️ Ancient Bank</h1>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
                Lorem ipsum
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button 
                    onClick={() => navigateTo('login')}
                    style={{ padding: '15px 30px', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                    Log In
                </button>
                <button 
                    onClick={() => navigateTo('register')}
                    style={{ padding: '15px 30px', fontSize: '1rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                    Sign Up
                </button>
            </div>
        </div>
    );
}

export default Home;
