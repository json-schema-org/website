import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import React from 'react';

export default function DarkModeToggle() {
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
    const dataTheme = isDarkMode ? 'light' : 'dark';
    const keyShadow = isDarkMode
      ? 'inset 0 -2px 0 0 #ffffff, inset 0 0 1px 1px #ffffff, 0 2px 2px 0 rgba(3, 4, 9, 0.3)'
      : 'inset 0 -2px 0 0 #cdcde6,inset 0 0 1px 1px #fff,0 1px 2px 1px rgba(30,35,90,0.4)';
    const keyGrad = 'linear-gradient(-225deg, #d5dbe4, #f8f8f8)';
    document.documentElement.setAttribute('data-theme', dataTheme);
    document.documentElement.style.setProperty(
      '--docsearch-key-gradient',
      keyGrad,
    );
    document.documentElement.style.setProperty(
      '--docsearch-key-shadow',
      keyShadow,
    );

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
}
