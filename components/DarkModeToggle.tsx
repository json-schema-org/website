import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import React from 'react';

function ListItem({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className='p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-md transition duration-150 flex row gap-2 w-full text-sm'
    >
      {children}
    </div>
  );
}

export default function DarkModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  const [showSelect, setShowSelect] = useState(false);
  const [activeThemeIcon, setActiveThemeIcon] = useState('');
  useEffect(() => {
    switch (theme) {
      case 'system':
        return setActiveThemeIcon('/icons/theme-switch.svg');
      case 'light':
        return setActiveThemeIcon('/icons/sun.svg');
      case 'dark':
        return setActiveThemeIcon('/icons/moon.svg');
    }
  }, [theme, resolvedTheme]);

  return (
    <div className='relative w-10 h-10 dark-mode-toggle-container'>
      <button
        onClick={() => setShowSelect(!showSelect)}
        className='dark-mode-toggle rounded-md dark:hover:bg-gray-700 p-1.5 hover:bg-gray-100 transition duration-150 '
      >
        <Image
          src={activeThemeIcon}
          alt='Dark Mode'
          width={25}
          height={25}
          style={{
            // Invert the icon color based on the theme, theme of the light mode is dark
            filter: isDarkMode ? 'invert(1)' : 'invert(0)',
          }}
        />
      </button>
      <div
        className='absolute right-0 p-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 z-10 w-max'
        style={{ display: showSelect ? 'block' : 'none' }}
        onMouseLeave={() => {
          setShowSelect(false);
        }}
        tabIndex={0}
      >
        <ListItem onClick={() => setTheme('system')}>
          <Image
            src='/icons/theme-switch.svg'
            alt='System theme'
            width={18}
            height={18}
            style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
          />
          System
        </ListItem>
        <ListItem onClick={() => setTheme('light')}>
          <Image
            src='/icons/sun.svg'
            alt='System theme'
            width={18}
            height={18}
            style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
          />
          Light
        </ListItem>
        <ListItem onClick={() => setTheme('dark')}>
          <Image
            src='/icons/moon.svg'
            alt='System theme'
            width={18}
            height={18}
            style={{ filter: isDarkMode ? 'invert(1)' : 'invert(0)' }}
          />
          Dark
        </ListItem>
      </div>
    </div>
  );
}
