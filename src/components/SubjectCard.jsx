import ProgressBar from "./ProgressBar";

    const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

function SubjectCard( { subject, week , onToggle}) {

    const done = DAYS.filter(d => week[subject.id]?.[d]).length;

    return (
        <div style={{
            border: `2px solid ${subject.color}`,
            borderLeft: `3px solid ${subject.color}`,
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px"
            }}>

                <span style={{
                    fontFamily: "Lexend, monospace",
                    fontSize: "18px",
                
                }}>
                    {subject.icon} {subject.label}
                </span>

                <span style={{
                    fontSize: "14px",
                    color: "#661"
                }}>
                    {done} / 5 days
                </span>
            </div>

            <ProgressBar value={done} max={5} color={subject.color} />

            <div style={{ 
                display: "flex", 
                gap: "8px", 
                marginTop: "8px" }}>

                {DAYS.map(d => {

                    const isChecked = !!week[subject.id]?.[d];

                    return (
                        <button 
                            key={d}
                            onClick={() => onToggle(subject.id, d)}
                            style={{
                                flex: 1,
                                padding: "8px",
                                borderRadius: "4px",
                                border: `1px solid ${subject.color}`,
                                background: isChecked ? subject.color : "#fff",
                                color: isChecked ? "#fff" : subject.color,
                                cursor: "pointer",
                                fontWeight: isChecked ? "bold" : "normal",
                                textTransform: "uppercase",
                                fontSize: "12px",
                                transition: "all 0.15s"
                            }}
                        >
                            {d.substring(0, 3)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default SubjectCard;
