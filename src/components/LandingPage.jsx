import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';

const LandingPage = () => {
    const navigate = useNavigate();
    const { theme } = useAccessibility();

    // Determine which logo to show based on the theme
    // If 'system', we need to check the actual active theme from the document attribute
    const activeTheme = theme === 'system'
        ? document.documentElement.getAttribute('data-theme')
        : theme;

    const logoSrc = activeTheme === 'dark'
        ? '/images/logo_Juventude_Diocese_b_sfundo.png'
        : '/images/logo_Juventude_Diocese.png';

    return (
        <div className="welcome-screen">
            <h3>Bem-vindo à Via Sacra Jovem 2026</h3>
            <p>Jovens Santos que nos inspiram</p>
            <button className="btn-start" onClick={() => navigate('/station/1')}>
                Começar a Via Sacra
            </button>
            <div className="landing-footer">
                <a href="https://diocese-setubal.pt/juventude/" target="_blank" rel="noopener noreferrer">
                    <img src={logoSrc} alt="Logo Departamento da Juventude da Diocese de Setúbal" className="landing-logo" />
                </a>
            </div>
        </div>
    );
};

export default LandingPage;
