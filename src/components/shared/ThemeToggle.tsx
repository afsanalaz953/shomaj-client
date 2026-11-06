// components/shared/ThemeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "@gravity-ui/icons";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-6 w-10" />; // SSR placeholder

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isDark ? "bg-cyan-500" : "bg-blue-500"
      }`}
    >
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform ${
          isDark ? "translate-x-5" : "translate-x-0.5"
        }`}
      >
        {isDark ? (
          <Sun className="size-3.5 text-cyan-600" />
        ) : (
          <Moon className="size-3.5 text-blue-600" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;





// "use client"

// import {Sun, Moon} from "@gravity-ui/icons";
// import {Switch} from "@heroui/react";
// import { useTheme } from "next-themes";

// const ThemeToggle = () => {
//       const { theme, setTheme } = useTheme();
//     return (
//      <Switch onChange={() => setTheme(theme==="dark" ? "light" : "dark")}> 
//       {({isSelected}) => (
//         <>
//           <Switch.Control
//             className={`h-6 w-8 bg-blue-500 ${isSelected ? "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]" : ""}`}
//           >
//             <Switch.Thumb
//               className={`size-[27 px] bg-white shadow-sm ${isSelected ? "ms-[22 px] shadow-lg" : ""}`}
//             >
//               <Switch.Icon>
//                 {isSelected ? (
//                   <Sun className="size-4 text-cyan-600" />
//                 ) : (
//                   <Moon className="size-4 text-blue-600" />
//                 )}
//               </Switch.Icon>
//             </Switch.Thumb>
//           </Switch.Control>
//         </>
//       )}
//     </Switch>
    
    
    
//         //      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
//     //   Toggle {theme === "dark" ? "Light" : "Dark"} Mode
//     // </button>
//     );
// };

// export default ThemeToggle;