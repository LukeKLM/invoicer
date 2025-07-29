"use client";

import { createContext, useState, ReactNode, useContext } from "react";

type LayoutContextType = {
  setHeaderContent: (content: ReactNode) => void;
  headerContent: ReactNode;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {

  const [headerContent, setHeaderContent] = useState<ReactNode>(null);

  return (
    <LayoutContext.Provider value={{ headerContent, setHeaderContent }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
