import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TOTAL_STATIONS } from '../constants';

const Navigation = ({ isOpen, onClose }) => {
    const stations = Array.from({ length: TOTAL_STATIONS }, (_, i) => i + 1);
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
                        Início
                    </Link>
                </li>
                {stations.map((num) => (
                    <li key={num}>
                        <Link
                            to={`/station/${num}`}
                            onClick={onClose}
                            className={currentPath === `/station/${num}` ? 'active' : ''}
                        >
                            Estação {num}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

Navigation.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Navigation;
