import { useState, useEffect } from 'react';
import './App.css';

import ProgressBar from './components/ProgressBar';
import SubjectCard from './components/SubjectCard';
import Notes from './components/Notes';
import WeekNav from './components/WeekNav';
import ProgressMatrix from './components/ProgressMatrix';
import OGProgress from './components/OGProgress';

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

//--- LOCAL STORAGE HELPERS ---

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const load = (key, fallback) =>  {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

//--- STATE ACTIVE DATA ---

export default function HomeschoolTracker() {
  const [current_week, set_current_week] = useState(() =>load("current_week", 1));
  const [weeks, set_weeks] = useState(() => load("weeks", {}));
  const [completed_og_steps, set_completed_og_steps] = useState(() => load("completed_og_steps", {}));

  const [notes, set_notes] = useState(() => load("notes", {}));
    const [tab, set_tab] = useState("planner");

  const [is_reset_hovered, set_is_reset_hovered] = useState(false);

//--- LOCAL STORAGE EFFECTS ---

  useEffect(() => { save("current_week", current_week); }, [current_week]);
  useEffect(() => { save("weeks", weeks); }, [weeks]);
  useEffect(() => { save("completed_og_steps", completed_og_steps); }, [completed_og_steps]);
  useEffect(() => { save("notes", notes); }, [notes]);

  const week = weeks[current_week] || {};

  //--- INTERACTION CONTROLLERS ---

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
  

  return (
    <div className="container">
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />

      <header className="header">
        <h1 className="title">homeschool tracker</h1>
        <div className="subtitle">weekly planner | progress | notes</div>
      </header>

      {/* NAV BAR */}

      <div className="tabs-bar">
        {[["planner", "weekly planner"], ["og", "progress"], ["notes", "notes"]].map(([id, label]) => (
          <button
            key={id}
            className={`tab-item ${tab === id ? 'active' : ''}}`}
            onClick={() => set_tab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <main className="body">
        {tab === "planner" && (
          <>
            <WeekNav current_week={current_week} set_current_week={set_current_week} />

            <ProgressMatrix
              weeks={weeks}
              current_week={current_week}
              set_current_week={set_current_week}
              SUBJECTS={SUBJECTS}
              DAYS={DAYS}
            />

            <div className="summary-bar">
              <span>this week: {total_done} / {total_possible} sessions completed</span>
              <span>{total_possible === 0 ? 0 : Math.round((total_done / total_possible) * 100)}% </span>
            </div>

            <ProgressBar value={total_done} max={total_possible} color="#4CAF50" />
            <div style={{ height: 16}} />

            <button
              className={`reset-week-button ${is_reset_hovered ? 'hover' : ''}`}
              onMouseEnter={() => set_is_reset_hovered(true)}
              onMouseLeave={() => set_is_reset_hovered(false)}
              onClick={reset_week}
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
          <OGProgress
            completed_og_steps={completed_og_steps}
            set_completed_og_steps={set_completed_og_steps}
            OG_STEPS={OG_STEPS}
          />
        )}

        {tab === "notes" && (
          <Notes
            notes={notes}
            current_week={current_week}
            set_current_week={set_current_week}
            onAddNote={(text) => {
              const key = `week${current_week}`;
              set_notes(prev => ({
                ...prev,
                [key]: [...(prev[key] || []), { text: text, date: new Date().toLocaleString() }]
              }));
            }}
          />
        )}
      </main>
    </div>
  );
}
