function DashboardStats({ tasks }) {
    const totalTasks = tasks.length;

    const completedTasks = tasks.filter((task) => {
        return task.completed;
    }).length;

    const activeTasks = tasks.filter((task) => {
        return !task.completed;
    }).length;

    return (
        <div className="stats">

            <div className="stat-card">
                <span className="stat-label">Total Tasks</span>
                <strong className="stat-number">{totalTasks}</strong>
            </div>

            <div className="stat-card">
                <span className="stat-label">Active Tasks</span>
                <strong className="stat-number">{activeTasks}</strong>
            </div>

            <div className="stat-card">
                <span className="stat-label">Completed</span>
                <strong className="stat-number">{completedTasks}</strong>
            </div>

        </div>
    );
}

export default DashboardStats;