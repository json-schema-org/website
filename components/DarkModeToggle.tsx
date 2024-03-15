import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import React from 'react';

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isClickable, setIsClickable] = useState(true);
  const [img, setImg] = useState('/icons/moon.svg');

  const toggleDarkMode = () => {
    if (!isClickable) return;

    setIsClickable(false);
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);

    setTimeout(() => {
      setIsClickable(true);
    }, 500);
  };

  useEffect(() => {
    if (!theme) setTheme('light');

    const img = theme === 'dark' ? '/icons/sun.svg' : '/icons/moon.svg';
    setImg(img);
  }, [theme, setTheme]);

  return (
    <button
      onClick={toggleDarkMode}
      className='dark-mode-toggle rounded-md dark:hover:bg-gray-700 p-1.5 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150'
      disabled={!isClickable}
    >
      <img src={img} alt='Dark Mode' width={25} height={25} />
    </button>
  );
};

export default DarkModeToggle;
