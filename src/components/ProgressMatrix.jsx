function ProgressMatrix ({ weeks, current_week, set_current_week , SUBJECTS, DAYS}) {

    return (
        <div className="matrix-container">
            <div className="matrix-header">
                <h3 className="matrix-title">progress</h3>
                <span className="matrix-hint">select box to jum to week</span>
            </div>

            <div className="matrix-grid">
                {Array.from({ length: 52 }).map((_, index) => {
                    const week_num = index + 1;
                    const target_week_data = weeks[week_num] || {};

                    const completed_in_week = SUBJECTS.reduce((acc, s) => {
                        return acc + DAYS.filter(d => target_week_data[s.id]?.[d]).length;
                    }, 0);

                    const weekly_max = SUBJECTS.length * DAYS.length;
                    const intensity = completed_in_week === 0 ? 0 : completed_in_week / weekly_max;
                    const is_current_week = current_week === week_num;

                    const bg_grid = intensity === 0 ? "#EBEDF0" : intensity <= 0.25 ? "#9BE9A8" : intensity <= 0.5 ? "#40C463" : intensity <= 0.75 ? "#30A14E" : "#216E39";
                    const text_color_grid = intensity > 0.25 ? "fff" : "666";
                    
                    return (
                        <div
                            key={index}
                            onClick={() => set_current_week(week_num)}
                            title={`week ${week_num}: ${completed_in_week}/${weekly_max} steps completed`}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                backgroundColor: bg_grid,
                                color: text_color_grid,
                                border: is_current_week ? "3px solid #4CAF50" : "1px solid #ccc",
                                transform: is_current_week ? "scale(1.1)" : "scale(1)",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {week_num}
                        </div>
                    );
                })}
            </div>

        </div>

    );

}

export default ProgressMatrix;