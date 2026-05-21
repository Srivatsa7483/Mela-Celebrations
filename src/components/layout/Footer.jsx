import React from 'react';
import './Footer.css';

export default function Footer({ setCurrentPage }) {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <p>&copy; {new Date().getFullYear()} Mela Celebrations. All rights reserved.</p>
            </div>
        </footer>
    );
}