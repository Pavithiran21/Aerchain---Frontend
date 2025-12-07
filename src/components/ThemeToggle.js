import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, onToggle }) => {
  return (
    <button 
      className="theme-toggle"
      onClick={onToggle}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;