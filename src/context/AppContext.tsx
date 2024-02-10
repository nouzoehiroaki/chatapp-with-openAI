'use client';
import type { User} from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import type { ReactNode} from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '../../firebase';

type AppProviderProps = {
  children: ReactNode;
}
type AppContextType = {
  user: User | null;
  userId: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  selectedRoom: string | null;
  setSelectedRoom: React.Dispatch<React.SetStateAction<string | null>>;
  selectRoomName: string | null;
  setSelectRoomName: React.Dispatch<React.SetStateAction<string | null>>;
};

const defalutContextData = {
  user: null,
  userId: null,
  setUser: () => { },
  selectedRoom: null,
  setSelectedRoom: () => { },
  selectRoomName: null,
  setSelectRoomName: () => { },
};
const AppContext = createContext<AppContextType>(defalutContextData);

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectRoomName, setSelectRoomName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      setUser(newUser);
      setUserId(newUser ? newUser.uid : null);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return <AppContext.Provider
    value={{
      user,
      userId,
      setUser,
      selectedRoom,
      setSelectedRoom,
      selectRoomName,
      setSelectRoomName
    }}>
    {children}
  </AppContext.Provider>;
};
export function useAppContext() {
  return useContext(AppContext);
}