import { SetStateAction, useEffect, useState } from "react"

// THEME
import { useTheme } from "../contexts/ThemeContext"

// COMPONENTS
import { Navbar } from "../components"

interface OrganizationItem {
    id: string,
    name: string,
    done: boolean
}

function Organization() {
    const memoryOrganizationKey = "organizations"
    const selectedOrganizationKey = 'selectedOrganization'

    const { theme, toggleTheme } = useTheme()
    const [organizations, setOrganizations] = useState<OrganizationItem[]>([])
    const [newOrganization, setNewOrganization] = useState<string>("")
    const [isLoaded, setIsLoaded] = useState(false)
    const [selectedOrganization, setSelectedOrganization] = useState('')

    const addOrganization = (): void => {

        // Tendo algum conteúdo no campo, segue com a criação da organização.
        if (newOrganization !== "") {
            const newId = crypto.randomUUID()

            const newOrganizationItem: OrganizationItem = {
                id: newId,
                name: newOrganization,
                done: false
            }

            // Salvando no array de organizações.
            setOrganizations([...organizations, newOrganizationItem])
            // Limpando o campo de entrada.
            setNewOrganization("")
            // Atualizando memória.
            setSelectedOrganization(newOrganizationItem.name)
        }
    }

    // Prepara o nome da organização selecionada
    const selectOrganization = (event: { target: { value: SetStateAction<string> } }) => {
        setSelectedOrganization(event.target.value)
    }

    const removeOrganization = (id: string): void => {
        const updateOrganizations = organizations.filter((organization) => organization.id !== id)
        setOrganizations(updateOrganizations)

        if (updateOrganizations.length > 0) {
            setSelectedOrganization(updateOrganizations[0].name)
        }

        // Exclui lista de tarefas se ainda existir
        const clearOrganizationTasks = organizations.find((organization) => organization.id === id)
        const toClear = clearOrganizationTasks?.name
        if (localStorage.getItem(`${toClear}-tasks`)) {
            localStorage.removeItem(`${toClear}-tasks`)
        }

        // Exclui o último item da memória pois
        // a função de atualizar a memória não funciona quando
        // o array de organizações não tem mais nenhuma organização.
        // Também exclui a memória da organização selecionada.
        if (updateOrganizations.length == 0) {
            localStorage.removeItem(memoryOrganizationKey)
            localStorage.removeItem(selectedOrganizationKey)
        }
    }

    // Carrega o array de organizações na memória após
    // a memória ser conferida na renderização da página ou
    // o array ser atualizado.
    useEffect(() => {
        if (isLoaded && organizations.length > 0) {

            localStorage.setItem(memoryOrganizationKey, JSON.stringify(organizations))
        }
    }, [organizations, isLoaded])

    // Na primeira renderização confere a memória local se
    // há alguma organização e carrega o array.
    useEffect(() => {
        const memoryOrganization = localStorage.getItem(memoryOrganizationKey)

        if (memoryOrganization) {
            setOrganizations(JSON.parse(memoryOrganization))
        }

        setIsLoaded(true)
    }, [])

    // Guarda na memória o nome da organização selecionada.
    useEffect(() => {
        if (selectedOrganization) {
            localStorage.setItem(selectedOrganizationKey, selectedOrganization)
        }
    }, [selectedOrganization])

    // Seta a organização atual selecionada
    useEffect(() => {
        const memorySelectedOrganization = localStorage.getItem(selectedOrganizationKey)
        if (memorySelectedOrganization) {
            setSelectedOrganization(memorySelectedOrganization)
        }
    }, [])

    return (
        <div className={`app ${theme}`}>

            <Navbar theme={theme} />

            <div className={`container ${theme}`}>

                <h1>Lista de Organizações</h1>

                <div className='input-container'>
                    <input type="text" value={newOrganization} onChange={(e) => setNewOrganization(e.target.value)} />
                    <button onClick={addOrganization}>Adicionar organização</button>
                </div>

                <ol>
                    {
                        organizations.map((organization) => (
                            <li key={organization.id}>
                                <input
                                    type="radio"
                                    name='organization'
                                    value={organization.name}
                                    checked={selectedOrganization === organization.name}
                                    onChange={selectOrganization}
                                />

                                <span style={{ textDecoration: organization.done ? 'line-through' : 'none' }}>
                                    {organization.name}
                                </span>

                                <button onClick={() => removeOrganization(organization.id)}>REMOVER</button>
                            </li>
                        ))
                    }
                </ol>

                <button onClick={toggleTheme}>
                    Alterar para o tema {theme === "dark" ? "claro." : "escuro."}
                </button>
            </div>
        </div>
    )
}

export default Organization