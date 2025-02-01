import { Link } from 'react-router-dom'

// TYPES
import { NavbarButtonProps } from "../types"

export function NavbarButton(props: NavbarButtonProps) {
    const { href, linkText, isActive, theme } = props

    return (
        <Link
            className={`button ${theme} ${isActive}`}
            to={href}
        >
            {linkText}
        </Link>
    )
}