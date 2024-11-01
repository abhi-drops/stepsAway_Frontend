import React, { createContext, useState } from 'react';
import { getUserDataAPI } from '../../services/allAPI';

const UserContext = createContext();

export const UserProvider = ({ children }) =>
   {
  const [userResponse, setUserResponse] = useState(null);

  return (
    <UserContext.Provider value={[userResponse, setUserResponse]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
