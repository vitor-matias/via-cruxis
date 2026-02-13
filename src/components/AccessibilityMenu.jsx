import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Sun, Moon, AArrowUp, AArrowDown, Eye, SunMoon } from 'lucide-react';

const AccessibilityMenu = () => {
    const { toggleTheme, increaseFontSize, decreaseFontSize, theme } = useAccessibility();
    const [isOpen, setIsOpen] = useState(false);

    const getThemeIcon = () => {
        if (theme === 'system') return <SunMoon size={20} />;
        return theme === 'light' ? <Moon size={20} /> : <Sun size={20} />;
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
                    <button onClick={toggleTheme} className="menu-btn" aria-label="Toggle theme">
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
