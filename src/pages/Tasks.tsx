import { useEffect, useState } from "react"

// THEME
import { useTheme } from "../contexts/ThemeContext"

// COMPONENTS
import { Navbar } from "../components"

interface TodoItem {
    id: string,
    text: string,
    done: boolean
}

interface OrganizationItem {
    id: string,
    name: string,
    done: boolean
}

function Tasks() {
    const { theme, toggleTheme } = useTheme()
    const [memoryTasksKey, setMemoryTasksKey] = useState('')
    const [todos, setTodos] = useState<TodoItem[]>([])
    const [newTodo, setNewTodo] = useState<string>("")
    const [isLoaded, setIsLoaded] = useState(false)

    const organization = localStorage.getItem('selectedOrganization')

    // Seta o ponteiro para a memória correta
    useEffect(() => {
        if (organization) {
            setMemoryTasksKey(`${organization}-tasks`)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addTask = (): void => {

        // Tendo algum conteúdo no campo, segue com a criação da tarefa.
        if (newTodo !== "") {
            const newId = crypto.randomUUID()

            const newTodoItem: TodoItem = {
                id: newId,
                text: newTodo,
                done: false
            }

            // Salvando no array de tarefas.
            setTodos([...todos, newTodoItem])
            // Limpando o campo de entrada.
            setNewTodo("")
        }
    }

    const markTask = (id: string): void => {
        const updateTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, done: !todo.done }
            }

            return todo
        })

        setTodos(updateTodos)
    }

    const areAllDone = () => {
        const areAllDone = todos.every((todo) => {
            return todo.done
        })

        // Busca na memória de organizações a organização correspondente
        // para marcar como concluída. Usa o else para desmarcar a organização
        // caso alguma tarefa seja desmarcada e volte a ter tarefa pendente.
        const organizations = localStorage.getItem('organizations')
        const actualOrganizationMemory = organization
        if (areAllDone && organizations && actualOrganizationMemory) {
            const organizationsObject: OrganizationItem[] = JSON.parse(organizations)
            const thisOrganization = organizationsObject.find((organization) => { return organization.name === actualOrganizationMemory })
            const idThisOrganization = thisOrganization?.id
            const updateOrganizations = organizationsObject.map((organization) => {
                if (organization.id === idThisOrganization) {
                    return { ...organization, done: organization.done = true }
                }
                return organization
            })

            localStorage.setItem('organizations', JSON.stringify(updateOrganizations))
        } else if (!areAllDone && organizations && actualOrganizationMemory) {
            const organizationsObject: OrganizationItem[] = JSON.parse(organizations)
            const thisOrganization = organizationsObject.find((organization) => { return organization.name === actualOrganizationMemory })
            const idThisOrganization = thisOrganization?.id
            const updateOrganizations = organizationsObject.map((organization) => {
                if (organization.id === idThisOrganization) {
                    return { ...organization, done: organization.done = false }
                }
                return organization
            })

            localStorage.setItem('organizations', JSON.stringify(updateOrganizations))
        }
    }

    const removeTask = (id: string): void => {
        const updateTodos = todos.filter((todo) => todo.id !== id)
        setTodos(updateTodos)

        // Exclui o último item da memória pois
        // a função de atualizar a memória não funciona quando
        // o array de tarefas não tem mais nenhuma tarefa.
        if (updateTodos.length == 0) {
            localStorage.removeItem(memoryTasksKey)
        }
    }

    const getDoneTasks = (): TodoItem[] => {
        return todos.filter((todo) => todo.done)
    }

    useEffect(() => {
        if (isLoaded && todos.length > 0 && organization) {
            localStorage.setItem(memoryTasksKey, JSON.stringify(todos))

            areAllDone()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todos, isLoaded])

    useEffect(() => {
        const memoryTasks = localStorage.getItem(memoryTasksKey)

        if (memoryTasks) {
            setTodos(JSON.parse(memoryTasks))
        }
        setIsLoaded(true)
    }, [memoryTasksKey])



    return (
        <div className={`app ${theme}`}>

            <Navbar theme={theme} />

            <div className={`container ${theme}`}>

                <h1>Lista de Tarefas - {getDoneTasks().length} / {todos.length}</h1>

                <h2>{organization}</h2>

                <div className='input-container'>
                    <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                    <button
                        className='tooltip button-container'
                        onClick={addTask}
                        disabled={organization ? false : true}
                    >Adicionar tarefa</button>
                </div>

                <ol>
                    {
                        todos.map((todo) => (
                            <li key={todo.id}>
                                <input type="checkbox" checked={todo.done} onChange={() => markTask(todo.id)} />

                                <button
                                    style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
                                    className={`selectable ${theme}`}
                                    type='button'
                                    onClick={() => markTask(todo.id)}
                                >
                                    {todo.text}
                                </button>

                                <button className='remove' onClick={() => removeTask(todo.id)}>REMOVER</button>
                            </li>
                        ))
                    }
                </ol>

                <button className='button-container' onClick={toggleTheme}>
                    Alterar para o tema {theme === "dark" ? "claro." : "escuro."}
                </button>
            </div>
            <p>by Eder TS</p>
        </div>

    )
}

export default Tasks