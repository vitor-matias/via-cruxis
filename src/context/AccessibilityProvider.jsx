import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AccessibilityContext } from './AccessibilityContext';

export const AccessibilityProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'system';
    });

    const [activeTheme, setActiveTheme] = useState(() => {
        const storedTheme = localStorage.getItem('theme') || 'system';
        if (storedTheme === 'system') {
            return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return storedTheme;
    });

    const [fontSize, setFontSize] = useState(() => {
        return parseInt(localStorage.getItem('fontSize'), 10) || 100;
    });

    useEffect(() => {
        const applyTheme = (currentTheme) => {
            let nextActiveTheme = currentTheme;
            if (currentTheme === 'system') {
                if (window.matchMedia) {
                    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    nextActiveTheme = mediaQuery.matches ? 'dark' : 'light';
                } else {
                    nextActiveTheme = 'light'; // Default to light if matchMedia is unavailable
                }
            }
            document.documentElement.setAttribute('data-theme', nextActiveTheme);
            setActiveTheme(nextActiveTheme);

            // Update theme-color meta tag
            let metaColor = nextActiveTheme === 'dark' ? '#09070a' : '#2a1b3d';
            let metaTag = document.querySelector('meta[name="theme-color"]');
            if (metaTag) {
                metaTag.setAttribute('content', metaColor);
            }
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);

        // Set up listener for system theme changes
        let mediaQuery = null;
        let handleChange = null;

        if (theme === 'system' && window.matchMedia) {
            mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            handleChange = () => applyTheme('system');
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else if (mediaQuery.addListener) {
                mediaQuery.addListener(handleChange);
            }
        }

        // Clean up listener on unmount or theme change
        return () => {
            if (mediaQuery && handleChange) {
                if (mediaQuery.removeEventListener) {
                    mediaQuery.removeEventListener('change', handleChange);
                } else if (mediaQuery.removeListener) {
                    mediaQuery.removeListener(handleChange);
                }
            }
        };
    }, [theme]);

    useEffect(() => {
        document.documentElement.style.setProperty('--user-font-size', `${fontSize}%`);
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            if (prevTheme === 'light') return 'dark';
            if (prevTheme === 'dark') return 'system';
            return 'light';
        });
    };

    const increaseFontSize = () => {
        setFontSize((prevSize) => Math.min(prevSize + 10, 150)); // Max 150%
    };

    const decreaseFontSize = () => {
        setFontSize((prevSize) => Math.max(prevSize - 10, 80)); // Min 80%
    };

    return (
        <AccessibilityContext.Provider
            value={{
                theme,
                activeTheme,
                fontSize,
                toggleTheme,
                increaseFontSize,
                decreaseFontSize,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};

AccessibilityProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
