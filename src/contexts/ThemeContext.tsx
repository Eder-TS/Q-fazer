import { createContext, ReactNode, useContext, useState } from "react"

interface ThemeContextType {
    theme: "light" | "dark"
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const toggleTheme = () => {
        setTheme((previousTheme) => (previousTheme === "light" ? "dark" : "light"))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useTheme deve ser usado com um ThemeProvider")
    }

    return context
}