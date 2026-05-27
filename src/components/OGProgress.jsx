function OGProgress({ completed_og_steps, set_completed_og_steps, OG_STEPS }) {
    return (
        <div className="og-section">
            <h2 className="og-section-title">Orton-Gillingham Progress</h2>
            <p className="og-section-hint">
                click any step to mark it completed - completed steps turn green
            </p>

            <div className="og-card-body">
                {OG_STEPS.map((step, index) => {
                    
                    const isDone = !!completed_og_steps[index];
                    
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                set_completed_og_steps(prev => ({
                                    ...prev,
                                    [index]: !prev[index]
                                }));
                            }}                     
                            style={{
                                padding: "12px",
                                marginBottom: "8px",
                                borderRadius: "6px",
                                background: isDone ? "#4caf50" : "#f0f0f0",
                                border: isDone ? "1px solid #4caf50" : "1px solid #ccc",
                                fontSize: "14px",
                                color: isDone ? "#ffffff" : "#333",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {isDone ? "" : " "} {index + 1}. {step}
                        </div>
                    );
                })}
            </div>   
        </div>
    );
}

export default OGProgress;