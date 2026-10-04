import { useEffect, useState } from "react";
import "./App.css";

import { getTasks } from "./api/taskApi";

import Sidebar from "./components/Sidebar";
import DashboardStats from "./components/DashboardStats";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        async function fetchTasks() {
            try {
                setLoading(true);
                setError("");

                const data = await getTasks();

                setTasks(data);

            } catch (error) {
                console.log("Error:", error);
                setError(
                    "Could not load tasks. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchTasks();
    }, []);

    function handleTaskAdded(newTask) {
        setTasks((previousTasks) => {
            return [...previousTasks, newTask];
        });
    }

    function handleTaskUpdated(updatedTask) {
        setTasks((previousTasks) => {
            return previousTasks.map((task) => {
                if (task._id === updatedTask._id) {
                    return updatedTask;
                }

                return task;
            });
        });
    }

    function handleTaskDeleted(taskId) {
        setTasks((previousTasks) => {
            return previousTasks.filter((task) => {
                return task._id !== taskId;
            });
        });
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === "active") {
            return !task.completed;
        }

        if (filter === "completed") {
            return task.completed;
        }

        return true;
    });

    return (
        <div className="app">

            <Sidebar
                filter={filter}
                onFilterChange={setFilter}
            />

            <main className="main-content">

                <div className="container">

                    <header className="app-header">

                        <h1>Dashboard</h1>

                        <p>
                            Organize your tasks and keep track
                            of your progress.
                        </p>

                    </header>

                    <DashboardStats tasks={tasks} />

                    <section className="task-section">

                        <TaskForm
                            onTaskAdded={handleTaskAdded}
                        />

                        {loading && (
                            <p className="status-message">
                                Loading tasks...
                            </p>
                        )}

                        {error && (
                            <p className="error-message">
                                {error}
                            </p>
                        )}

                        {!loading && !error && (
                            <TaskList
                                tasks={filteredTasks}
                                onTaskUpdated={handleTaskUpdated}
                                onTaskDeleted={handleTaskDeleted}
                            />
                        )}

                    </section>

                </div>

            </main>

        </div>
    );
}

export default App;