import { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Sun, Moon, AArrowUp, AArrowDown, Eye, SunMoon } from 'lucide-react';

const AccessibilityMenu = () => {
    const { toggleTheme, increaseFontSize, decreaseFontSize, theme } = useAccessibility();
    const [isOpen, setIsOpen] = useState(false);

    const getThemeIcon = () => {
        switch (theme) {
            case 'light': return <Sun size={20} />;
            case 'dark': return <Moon size={20} />;
            case 'system': return <SunMoon size={20} />;
            default: return <SunMoon size={20} />;
        }
    };

    const getNextThemeLabel = () => {
        switch (theme) {
            case 'light': return 'Mudar para o tema escuro';
            case 'dark': return 'Mudar para o tema de sistema';
            case 'system': return 'Mudar para o tema claro';
            default: return 'Mudar de tema';
        }
    };

    return (
        <div className="accessibility-menu">
            <button
                className="fab-btn"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Accessibility options"
            >
                <Eye size={24} />
            </button>

            {isOpen && (
                <div className="menu-options">
                    <button
                        onClick={toggleTheme}
                        className="menu-btn"
                        aria-label={getNextThemeLabel()}
                        title={getNextThemeLabel()}
                    >
                        {getThemeIcon()}
                    </button>
                    <button onClick={increaseFontSize} className="menu-btn" aria-label="Increase font size">
                        <AArrowUp size={20} />
                    </button>
                    <button onClick={decreaseFontSize} className="menu-btn" aria-label="Decrease font size">
                        <AArrowDown size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AccessibilityMenu;
