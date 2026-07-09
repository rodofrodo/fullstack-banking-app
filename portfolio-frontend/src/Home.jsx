import React from 'react';
import './App.css';

function Home({ navigateTo }) {
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
                        onClick={() => navigateTo('login')}
                    >
                        Log in
                    </button>

                    <button
                        className='btn-secondary'
                        onClick={() => navigateTo('register')}
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
