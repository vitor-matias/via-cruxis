import PropTypes from 'prop-types';
import { memo } from 'react';

const getRomanNumeral = (num) => {
    const romanNumerals = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV',
        5: 'V',
        6: 'VI',
        7: 'VII',
        8: 'VIII',
        9: 'IX',
        10: 'X',
        11: 'XI',
        12: 'XII',
        13: 'XIII',
        14: 'XIV',
    };
    return romanNumerals[num];
}

const Footer = ({ currentStation, totalStations, onPrev, onNext }) => {
    if (currentStation === 0) return null; // Don't show footer on welcome screen

    return (
        <footer>
            <div className="navigation-controls">
                <button
                    className="nav-btn"
                    onClick={onPrev}
                    disabled={currentStation <= 1}
                >
                    Anterior
                </button>

                <span className="station-indicator">
                    {getRomanNumeral(currentStation)} Estação
                </span>

                <button
                    className="nav-btn"
                    onClick={onNext}
                    disabled={currentStation >= totalStations}
                >
                    Próxima
                </button>
            </div>
        </footer>
    );
};

Footer.propTypes = {
    currentStation: PropTypes.number.isRequired,
    totalStations: PropTypes.number.isRequired,
    onPrev: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

export default memo(Footer);
