import ProgressBar from "./ProgressBar";

    const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

function SubjectCard( { subject, week , onToggle}) {

    const done = DAYS.filter(d => week[subject.id]?.[d]).length;

    return (
        <div className="subject-card"
            style={{ border: `2px solid ${subject.color}`, borderRadius: "8px", padding: "12px", background: "#fff" }}>

            <div className="subject-card-header">

                <span className="subject-card-title">
                    {subject.icon} {subject.label}
                </span>

                <span className="subject-card-counter">
                    {done} / 5 days
                </span>
            </div>

            <ProgressBar value={done} max={5} color={subject.color} />

            <div className="subject-card-days-row">

                {DAYS.map(d => {

                    const isChecked = !!week[subject.id]?.[d];

                    return (
                        <button 
                            key={d}
                            onClick={() => onToggle(subject.id, d)}
                            className="subject-day-button"
                            style={{
                                border: `1px solid ${subject.color}`,
                                background: isChecked ? subject.color : 'transparent',
                                color: isChecked ? '#fff' : subject.color,
                                fontWeight: isChecked ? 'bold' : 'normal',
                            }}
                        >
                            {d}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default SubjectCard;
