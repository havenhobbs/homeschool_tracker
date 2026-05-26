import { useState, useEffect } from 'react';
import ProgressBar from './components/ProgressBar';
import SubjectCard from './components/SubjectCard';

//--- CONSTANTS ---

const SUBJECTS = [
  { id: "reading", label: "reading / phonics", icon: "📚", color: "#4CAF50" },
  { id: "math", label: "math", icon: "🧮", color: "#2196F3" },
  { id: "writing", label: "writing", icon: "✏️", color: "#FF9800" },
  { id: "science", label: "science", icon: "🧪", color: "#9C27B0" },
  { id: "art", label: "art", icon: "🎨", color: "#E91E63" },
  { id: "life", label: "life skills", icon: "🏠", color: "#3F51B5" },
];

const OG_STEPS = [
  "phonemic awareness - sounds without letters",
  "letter-sound correspondence (Aa -> /a/)",
  "CVC words (cat, dog, sit)",
  "consonant blends (bl, cr, st, tr)",
  "short vowel patterns (CVCe, CVVC)",
  "long vowel teams (ai, ea, oo, eo)",
  "r-controlled vowels (ar, er, ir, or, ur)",
  "multisyllabic words (banana, computer)",
  "morphology (prefixes, suffixes, roots)",
  "fluency (reading with speed, accuracy, expression)",
  "comprehension (understanding what is read)"
];

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

//--- STORAGE HELPERS ---

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const load = (key, fallback) =>  {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

//--- MAIN APP ---

export default function HomeschoolTracker() {
  const [current_week, set_current_week] = useState(() =>load("current_week", 1));
  const [weeks, set_weeks] = useState(() => load("weeks", {}));
  const [completed_og_steps, set_completed_og_steps] = useState(() => load("completed_og_steps", 0));

  const [notes, set_notes] = useState(() => load("notes", {}));
  const [note_input, set_note_input] = useState("");
  const [tab, set_tab] = useState("planner");

  const [is_reset_hovered, set_is_reset_hovered] = useState(false);

  useEffect(() => { save("current_week", current_week); }, [current_week]);
  useEffect(() => { save("weeks", weeks); }, [weeks]);
  useEffect(() => { save("completed_og_steps", completed_og_steps); }, [completed_og_steps]);
  useEffect(() => { save("notes", notes); }, [notes]);

  const week = weeks[current_week] || {};

  const toggle_day = (subject_id, day) => {
    set_weeks(prev => ({
      ...prev,
      [current_week]: {
        ...prev[current_week],
        [subject_id]: {
          ...(prev[current_week]?.[subject_id] || {}),
          [day]: !(prev[current_week]?.[subject_id]?.[day])
        }
      }
    }));
  };

  const reset_week = () => {
    if (window.confirm("are you sure you want to reset this week? all progress and notes will be lost")) {
      set_weeks(prev => ({
        ...prev,
        [current_week]: {}
      }));
      set_notes(prev => ({
        ...prev,
        [`week${current_week}`]: []
      }));
    }
  };
  const total_done = SUBJECTS.reduce((acc, s) =>
    acc + DAYS.filter(d => week[s.id]?.[d]).length, 0);
  const total_possible = SUBJECTS.length * DAYS.length;

  const add_note = () => {
    if (!note_input.trim()) return;

    const key = `week${current_week}`;
    set_notes(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), { text: note_input, date: new Date().toLocaleString() }]
    }));
    set_note_input("");
  };

  const S = {
    container: {
      fontFamily: "Lexend, monospace",
      maxWidth: "2400px",
      width: "100%",
      margin: "0 auto",
      background: "#f9f9f9",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
    },

    header: {
      background: "#333",
      color: "#fff",
      padding: "20px",
      textAlign: "center",
    }, 

    title: {
      fontFamily: "Lexend, monospace",
      fontSize: "24px",
      margin: "0",
    },

    subtitle: {
      color: "#ccc",
      fontSize: "14px",
      margin: "5px 0 0",
    },

    tabs: {
      display: "flex",
      background: "#eee",
    },

    tab: (active) => ({
      flex: 1,
      padding: "10px",
      border: "none",
      cursor: "pointer",
      background: active ? "#ddd" : "transparent",
      fontWeight: active ? "bold" : "normal",
      color: active ? "#333" : "#666",
      fontFamily: "Lexend, monospace",
      fontSize: "14px",
      borderBottom: active ? "2px solid #333" : "2px solid transparent",
    }),

    body: {
      padding: "20px",
      flex: 1,
    }, 

    week_nav: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },

    nav_button: {
      background: "#2196F3",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      fontFamily: "Lexend, monospace",
      fontSize: "14px",
      borderRadius: "4px"
    },

    reset_week_button: {
      background: "#fff",
      color: "#f44336",
      border: "1px solid #f44336",
      padding: "10px 20px",
      cursor: "pointer",
      fontFamily: "Lexend, monospace",
      fontSize: "14px",
      borderRadius: "4px",
      width: "100%",
      marginBottom: "20px",
      transition: "background 0.15s ease, color 0.15s ease",
      
    },

    reset_week_button_hover: {
      background: "#f44336",
      color: "#fff"
    },
    
    week_label: {
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "Lexend, monospace"
    },

    summary_bar: {
      background: "#eee",
      color: "#333",
      borderRadius: "4px",
      padding: "10px",
      textAlign: "center",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: "Lexend, monospace",
      fontSize: "14px",
    },

    section: {
      marginBottom: "20px",
    },

    section_title: {
      fontFamily: "Lexend, monospace",
      fontSize: "18px",
      marginBottom: "10px",
      color: "#333",
      borderBottom: "2px solid #333",
      paddingBottom: "5px"
    },

    og_card: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "15px",
    },

    og_step: (active, done) => ({
      padding: "10px",
      marginBottom: "5px",
      borderRadius: "4px",
      background: done ? "#4CAF50" : "#eee",
      border: done ? "1px solid #4CAF50" : "1px solid #ddd",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.15s ease",
      display: "flex",
      alignItems: "center"
    }), 

    note_input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      background: "#fff",
      fontFamily: "Lexend, monospace",
      fontSize: "14px",
      marginBottom: "10px",
    },

    note_button: {
      background: "#2196F3",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      cursor: "pointer",
      fontFamily: "Lexend, monospace",
      fontSize: "14px",
      borderRadius: "4px"
    },

    note_item: {
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "10px",
      marginBottom: "10px",
      fontFamily: "Lexend, monospace",
      fontSize: "14px"
    },
  };

  return (
    <div style={S.container}>
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;700&display=swap" rel="stylesheet" />
      <div style={S.header}>
        <h1 style={S.title}>homeschool tracker</h1>
        <div style={S.subtitle}>weekly planner | progress | notes</div>
      </div>

      <div style={S.tabs}>
        {[["planner", "weekly planner"], ["og", "progress"], ["notes", "notes"]].map(([id, label]) => (
          <button
            key={id}
            style={S.tab(tab === id)}
            onClick={() => set_tab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={S.body}>
        {tab === "planner" && (
          <>
            <div style={S.week_nav}>
              <button style={S.nav_button} onClick={() => set_current_week(w => Math.max(1, w - 1))}>◀</button>
              <span style={S.week_label}>week {current_week}</span>
              <button style={S.nav_button} onClick={() => set_current_week(w => w + 1)}>▶</button>
            </div>

            <div style={S.summary_bar}>
              <span>this week: {total_done}/{total_possible} sessions done</span>
              <span>{total_possible === 0 ? 0 : Math.round((total_done / total_possible) * 100)}%</span>
            </div>

            <ProgressBar value={total_done} max={total_possible} color="#4CAF50" />
            <div style={{ height: 16 }} />

            <button
              onClick={reset_week}
              onMouseEnter={() => set_is_reset_hovered(true)}
              onMouseLeave={() => set_is_reset_hovered(false)}
              style={{
                ...S.reset_week_button,
                ...(is_reset_hovered ? S.reset_week_button_hover : {})
              }}
            >
              reset week
            </button>

            {SUBJECTS.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                week={week}
                onToggle={toggle_day}
              />
            ))}
          </>
        )}

        {tab === "og" && (
          <div style={S.section}>
            <h2 style={S.section_title}>Orton-Gillingham Progress</h2>
            <p style={{ fontSize: "14px", color: "#555", marginBottom: "10px" }}>
              click a step to mark it as your current focus - completed steps turn green
            </p>
            <div style={S.og_card}>
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
                      ...S.og_step(false, isDone), 
                      color: isDone ? "#ffffff" : "#333"
                    }}
                  >
                    {isDone ? " " : ""}{step}
                  </div>
                );
              })}
            </div>

        </div>
      )}

        {tab === "notes" && (
          <div style={S.section}>
            <div style={S.section_title}>Week {current_week} notes</div>
            <textarea
              style={S.note_input}
              rows={4}
              placeholder="log observations, wins, struggles, things to revisit..."
              value={note_input}
              onChange={e => set_note_input(e.target.value)}
            />
            <button style={S.note_button} onClick={add_note}>add note</button>

            <div style={{ height: 12 }} />
            {(notes[`week${current_week}`] || []).map((note, index) => (
              <div key={index} style={S.note_item}>
                <div style={{ fontSize: "12px", color: "#999", marginBottom: "5px" }}>{note.date}</div>
                
                {note.text}

              </div>
            ))}

            {!(notes[`week${current_week}`] || []).length && (
              <div style={{ color: "#999", fontStyle: "italic" }}>no notes for this week yet</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
