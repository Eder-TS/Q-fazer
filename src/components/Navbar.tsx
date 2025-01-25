// THEME
import { useTheme } from '../contexts/ThemeContext'

// COMPONENTS
import { NavbarButton } from './NavbarButton'

export const Navbar = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { theme, toggleTheme } = useTheme()

    const actualTab = window.document.location.href.endsWith('/')



    return (
        <nav className={`navbar ${theme}`}>
            <NavbarButton
                href='/'
                linkText='Organização'
                isActive={
                    actualTab ? 'active' : ''
                }
            />

            <NavbarButton
                href='/tarefas'
                linkText='Tarefas'
                isActive={
                    actualTab ? '' : 'active'
                }
            />
        </nav>
    )
}