function Sidebar() {
    return (
        <aside className="sidebar">

            <div className="logo">
                ✓ TaskFlow
            </div>

            <nav className="sidebar-nav">
                <a href="#" className="active">
                    Dashboard
                </a>

                <a href="#">
                    My Tasks
                </a>

                <a href="#">
                    Completed
                </a>
            </nav>

            <div className="sidebar-bottom">
                <a href="#">Settings</a>
            </div>

        </aside>
    );
}

export default Sidebar;