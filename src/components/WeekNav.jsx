function WeekNav({ current_week, set_current_week }) {
    
    return (
        <div className="week-nav-bar">
            <button className="nav-button" onClick={() => set_current_week(w => Math.max(1, w-1))}>◀</button>
            <span className="week-label">week {current_week}</span>
            <button className="nav-button" onClick={() => set_current_week(w => w + 1)}>▶</button>
        </div>
    );
}

export default WeekNav;