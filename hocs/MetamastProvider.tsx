import { createContext, PropsWithChildren } from 'react';

type ContextValue = {};

const Context = createContext<ContextValue>({});

function MetamastProvider({ children }: PropsWithChildren) {
  return <Context.Provider value={{}}>{children}</Context.Provider>;
}

export default MetamastProvider;
