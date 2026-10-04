import { useState } from "react";
import { createTask } from "../api/taskApi";

function TaskForm({ onTaskAdded }) {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedTitle = title.trim();

        if (trimmedTitle === "") {
            setError("Task title is required.");
            return;
        }

        if (trimmedTitle.length < 3) {
            setError("Task title must be at least 3 characters.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const newTask = await createTask(trimmedTitle);

            onTaskAdded(newTask);

            setTitle("");

        } catch (error) {
            console.log("Create task error:", error);
            setError(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="task-form">

            <div className="task-form-header">
                <h2>Add New Task</h2>

                <p>
                    Create a task and keep track of your progress.
                </p>
            </div>

            <form onSubmit={handleSubmit}>

                <label htmlFor="task-title">
                    Task title
                </label>

                <div className="task-form-row">

                    <input
                        id="task-title"
                        type="text"
                        placeholder="e.g. Study React hooks"
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                            setError("");
                        }}
                        maxLength={100}
                        disabled={submitting}
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                    >
                        {submitting ? "Adding..." : "Add Task"}
                    </button>

                </div>

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

            </form>

        </div>
    );
}

export default TaskForm;