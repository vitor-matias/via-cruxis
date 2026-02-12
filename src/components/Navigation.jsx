import React from 'react';
import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ isOpen, onClose }) => {
    const stations = Array.from({ length: 14 }, (_, i) => i + 1);
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <nav className={isOpen ? 'open' : ''}>
            <button
                className="close-menu"
                onClick={onClose}
                aria-label="Fechar Menu"
            >
                <X size={24} />
            </button>
            <ul>
                <li>
                    <Link
                        to="/"
                        onClick={onClose}
                        className={currentPath === '/' ? 'active' : ''}
                    >
                        <button style={{ all: 'unset', width: '100%', cursor: 'pointer' }}>
                            Início
                        </button>
                    </Link>
                </li>
                {stations.map((num) => (
                    <li key={num}>
                        <Link
                            to={`/station/${num}`}
                            onClick={onClose}
                            className={currentPath === `/station/${num}` ? 'active' : ''}
                        >
                            <button style={{ all: 'unset', width: '100%', cursor: 'pointer' }}>
                                Estação {num}
                            </button>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navigation;
