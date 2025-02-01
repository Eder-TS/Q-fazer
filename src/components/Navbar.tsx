// COMPONENTS
import { NavbarButton } from './NavbarButton'

// TYPES
import { NavbarProps } from '../types'

export function Navbar(props: NavbarProps) {
    const { theme } = props
    const actualTab = window.document.location.href.endsWith('/')



    return (
        <nav className={`navbar ${theme}`}>
            <NavbarButton
                href='/'
                linkText='Organização'
                isActive={
                    actualTab ? 'active' : ''
                }
                theme={theme}
            />

            <NavbarButton
                href='/tarefas'
                linkText='Tarefas'
                isActive={
                    actualTab ? '' : 'active'
                }
                theme={theme}
            />
        </nav>



    )
}