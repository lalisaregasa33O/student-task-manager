import { useState } from "react";
import {
    updateTask,
    deleteTask
} from "../api/taskApi";

function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    function startEditing(task) {
        setEditingId(task._id);
        setEditTitle(task.title);
        setError("");
        setActionError("");
    }

    function cancelEditing() {
        setEditingId(null);
        setEditTitle("");
        setError("");
    }

    async function handleSave(task) {
        const trimmedTitle = editTitle.trim();

        if (trimmedTitle === "") {
            setError("Task title cannot be empty.");
            return;
        }

        if (trimmedTitle.length < 3) {
            setError("Task title must be at least 3 characters.");
            return;
        }

        try {
            setActionError("");
            setActionLoading(task._id);

            const updatedTask = await updateTask(
                task._id,
                trimmedTitle,
                task.completed
            );

            onTaskUpdated(updatedTask);

            cancelEditing();

        } catch (error) {
            console.log("Edit error:", error);
            setActionError(error.message);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleToggle(task) {
        try {
            setActionError("");
            setActionLoading(task._id);

            const updatedTask = await updateTask(
                task._id,
                task.title,
                !task.completed
            );

            onTaskUpdated(updatedTask);

        } catch (error) {
            console.log("Update error:", error);
            setActionError(error.message);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleDelete(taskId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionError("");
            setActionLoading(taskId);

            await deleteTask(taskId);

            onTaskDeleted(taskId);

        } catch (error) {
            console.log("Delete error:", error);
            setActionError(error.message);
        } finally {
            setActionLoading(null);
        }
    }

    return (
        <div className="task-list">

            {actionError && (
                <p className="action-error">
                    {actionError}
                </p>
            )}

            <div className="task-list-header">

                <div>
                    <h2>My Tasks</h2>

                    <p>
                        Manage your current tasks.
                    </p>
                </div>

                <span className="task-count">
                    {tasks.length} tasks
                </span>

            </div>

            {tasks.length === 0 ? (

                <div className="empty-state">

                    <h3>No tasks found</h3>

                    <p>
                        There are no tasks in this section.
                    </p>

                </div>

            ) : (

                <div className="tasks">

                    {tasks.map((task) => {

                        const isLoading =
                            actionLoading === task._id;

                        return (
                            <div
                                className={`task-card ${
                                    task.completed
                                        ? "completed"
                                        : ""
                                }`}
                                key={task._id}
                            >

                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() =>
                                        handleToggle(task)
                                    }
                                    disabled={isLoading}
                                />

                                <div className="task-content">

                                    {editingId === task._id ? (

                                        <>
                                            <input
                                                className="edit-input"
                                                type="text"
                                                value={editTitle}
                                                onChange={(event) => {
                                                    setEditTitle(
                                                        event.target.value
                                                    );
                                                    setError("");
                                                }}
                                                maxLength={100}
                                                disabled={isLoading}
                                            />

                                            {error && (
                                                <span className="form-error">
                                                    {error}
                                                </span>
                                            )}
                                        </>

                                    ) : (

                                        <>
                                            <span className="task-title">
                                                {task.title}
                                            </span>

                                            <span className="task-status">
                                                {task.completed
                                                    ? "Completed"
                                                    : "In progress"}
                                            </span>
                                        </>

                                    )}

                                </div>

                                {editingId === task._id ? (

                                    <>
                                        <button
                                            className="save-button"
                                            onClick={() =>
                                                handleSave(task)
                                            }
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? "Saving..."
                                                : "Save"}
                                        </button>

                                        <button
                                            className="cancel-button"
                                            onClick={cancelEditing}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                    </>

                                ) : (

                                    <>
                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                startEditing(task)
                                            }
                                            disabled={isLoading}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDelete(task._id)
                                            }
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </>

                                )}

                            </div>
                        );
                    })}

                </div>

            )}

        </div>
    );
}

export default TaskList;