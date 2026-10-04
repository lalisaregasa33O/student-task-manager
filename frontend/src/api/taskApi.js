const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

export async function getTasks() {
    const response = await fetch(API_URL);

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to load tasks"
        );
    }

    return data;
}

export async function createTask(title) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create task"
        );
    }

    return data;
}

export async function updateTask(id, title, completed) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title,
            completed
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update task"
        );
    }

    return data;
}

export async function deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to delete task"
        );
    }

    return data;
}