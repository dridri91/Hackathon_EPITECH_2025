import React from 'react';

export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button className="theme-toggle" onClick={onToggle} title="Basculer thème">
      {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    </button>
  );
}

