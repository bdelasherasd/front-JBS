import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(false);
  const [rutasPermitidas, setRutasPermitidas] = useState([]);
  const [rutasControladas, setRutasControladas] = useState([]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        rutasPermitidas,
        setRutasPermitidas,
        rutasControladas,
        setRutasControladas,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
