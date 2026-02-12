import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ onMenuToggle }) => {
    return (
        <header>
            <div className="header-content">
                <div>
                    <h1>Via Sacra</h1>
                    <h2>Santidade Juvenil</h2>
                </div>
                <button
                    className="menu-toggle"
                    onClick={onMenuToggle}
                    aria-label="Abrir Menu"
                >
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
};

export default Header;
