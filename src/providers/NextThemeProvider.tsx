"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

type NextThemeProviderProps = {
  children: ReactNode;
};

const NextThemeProvider = ({ children}: NextThemeProviderProps) => {
   
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {children}
    </ThemeProvider>
  );
  
};

export default NextThemeProvider;