import React, { createContext, useState, useEffect, useContext } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'system';
    });

    const [fontSize, setFontSize] = useState(() => {
        return parseInt(localStorage.getItem('fontSize'), 10) || 100;
    });

    useEffect(() => {
        const applyTheme = (currentTheme) => {
            let activeTheme = currentTheme;
            if (currentTheme === 'system') {
                activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            document.documentElement.setAttribute('data-theme', activeTheme);

            // Update theme-color meta tag
            let metaColor = activeTheme === 'dark' ? '#09070a' : '#2a1b3d';
            let metaTag = document.querySelector('meta[name="theme-color"]');
            if (metaTag) {
                metaTag.setAttribute('content', metaColor);
            }
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
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
