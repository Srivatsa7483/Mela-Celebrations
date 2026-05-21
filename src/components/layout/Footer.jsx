import React from 'react';
import './Footer.css';

export default function Footer({ setCurrentPage }) {
    return (
        <footer className="footer">
            <div className="footer__inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p>&copy; {new Date().getFullYear()} Mela Celebrations. All rights reserved.</p>
                <button
                    onClick={() => setCurrentPage && setCurrentPage('admin')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        opacity: 0.7,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        padding: 0
                    }}
                >
                    Admin Login
                </button>
            </div>
        </footer>
    );
}