import { useState } from "react";

function Notes ({ notes, current_week, set_current_week, onAddNote }) {

    const [note_input, set_note_input] = useState("");

    const handleAddNote = () => {

        if (!note_input.trim()) return;
        onAddNote(note_input);
        set_note_input("");

    };

    return (
        <div className="notes-section">
            <div className="notes-section-title">add note for week {current_week}</div>

            <textarea 
                className="notes-textarea-input"
                rows={4}
                placeholder="log observations, wins, struggles, things to revisit later..."
                value={note_input}
                onChange={e => set_note_input(e.target.value)}
            />

            <button className="notes-submit-button" onClick={handleAddNote}>add note</button>

            <div className="archive-log-title">historical archive log</div>

            <div className="archive-list">
                {Object.keys(notes).length === 0 || Object.values(notes).flat().length === 0 ? (
                    <div className="archive-empty-text">no notes recorded in the archive yet </div>
                ) : (
                    Object.keys(notes)
                        .sort((a, b) => parseInt(a.replace("week ", "")) - parseInt(b.replace("week ", "")))
                        .map(weekKey => {
                            const weekNum = weekKey.replace("week ", "");
                            const weekNotes = notes[weekKey] || [];

                            if (weekNotes.length === 0) return null;

                            return (
                                <div key={weekKey} className="archive-card">
                                    <div className="archive-card-header">
                                        <span>week {weekNum} log</span>
                                        <button
                                        onClick={() => set_current_week(parseInt(weekNum))}
                                        className="archive-teleport-link"
                                        >
                                            go to week {weekNum} ➔
                                        </button>
                                    </div>
                                    
                                    {weekNotes.map((note, index) => (
                                        <div key={index} className="archive-note-item">
                                            <div className="archive-note-date">{note.date}</div>
                                            <div className="archive-note-text">{note.text}</div>
                                        </div>
                                     ))}
                                </div>
                            );
                        })
                )}

            </div>

        </div>
    );
}

export default Notes;