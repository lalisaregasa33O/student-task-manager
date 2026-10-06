function validateTaskTitle(title) {
    if (typeof title !== "string") {
        return "Task title is required.";
    }

    const cleanTitle = title.trim();

    if (cleanTitle.length < 3) {
        return "Task title must be at least 3 characters.";
    }

    if (cleanTitle.length > 100) {
        return "Task title cannot exceed 100 characters.";
    }

    return null;
}

module.exports = validateTaskTitle;