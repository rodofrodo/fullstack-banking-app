import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    return (
        <div className='home-container'>
            {/* top-left corner logo */}
            <div className='home-logo'>Ancient Bank</div>

            {/* central blue card */}
            <div className='home-gradient-card'>
                <h1 className='home-title'>
                    Banking made simple.<br/>
                    Start here.
                </h1>
            
                <div className='home-buttons-wrapper'>
                    <button
                        className='btn-primary'
                        onClick={() => navigate('/login')}
                    >
                        Log in
                    </button>

                    <button
                        className='btn-secondary'
                        onClick={() => navigate('/register')}
                    >
                        Sign up
                    </button>
                </div>
            </div>

            {/* footer */}
            <div className='home-footer'>
                Bartosz Strączek - 2026; GitHub: @rodofrodo
            </div>
        </div>
    );
}

export default Home;
