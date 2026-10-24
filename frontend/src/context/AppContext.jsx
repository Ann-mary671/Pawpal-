import React, { createContext, useState, useContext } from 'react';

/**
 * MODULE 3: Modern React Concepts & User Interaction
 * Demonstrating React Context (useContext) for global app preferences (e.g. favorites / theme)
 */

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [announcement, setAnnouncement] = useState('🐾 Spring Adoption Drive: 20% off all fees this month!');

  const toggleFavorite = (pet) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === pet.id);
      if (exists) {
        return prev.filter((item) => item.id !== pet.id);
      } else {
        return [...prev, pet];
      }
    });
  };

  const isFavorite = (petId) => {
    return favorites.some((item) => item.id === petId);
  };

  return (
    <AppContext.Provider value={{ favorites, toggleFavorite, isFavorite, announcement }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
