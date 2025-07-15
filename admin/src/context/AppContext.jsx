import React, { createContext } from 'react';

// Create a context
export const AppContext = createContext(); // Named export

// Create a provider component
export const AppContextProvider = (props) => {
  // Context value
  const value = {
   
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider; // Default export (optional)