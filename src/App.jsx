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

  //--- BACKUP ---
  const export_data = () => {
    const backup_data = {
      current_week,
      weeks,
      completed_og_steps,
      notes
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backup_data, null, 2))}`;

    const download_anchor = document.createElement('a');
    download_anchor.setAttribute("href", jsonString);
    download_anchor.setAttribute("download", `homeschool_tracker_backup_${new Date().toISOString()}.json`);
    document.body.appendChild(download_anchor);
    download_anchor.click();
    document.body.removeChild(download_anchor);
  };

  const import_data = (event) => {
    const file_reader = new file_reader();
    const uploaded_file = event.target.files[0];

    if (!uploaded_file) return;

    file_reader.onload = (e) => {
      try {
        const parsed_data  = JSON.parse(e.target.result);

        if (parsed_data.weeks || parsed_data.completed_og_steps || parsed_data.notes) {
          if (window.confirm("importing data will overwrite your current progress. are you sure?")) {
            if (parsed_data.current_week) set_current_week(parsed_data.current_week);
            if (parsed_data.weeks) set_weeks(parsed_data.weeks);
            if (parsed_data.completed_og_steps) set_completed_og_steps(parsed_data.completed_og_steps);
            if (parsed_data.notes) set_notes(parsed_data.notes);
          
            alert("backup imported successfully! your dashboard is now up to date :)");
          }
        } else {
          alert("the selected file does not appear to be a valid backup. please select a different file and try again.");
        }
      } catch {
        alert("there was an error importing the backup. please make sure you are selecting a valid backup file and try again.");
      }
    };

      file_reader.readAsTest(uploaded_file);
    };

  
  

  return (
    <div className="container">
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />

      <header className="header">
        <h1 className="title">homeschool tracker</h1>
        <div className="subtitle">2025 - 2026</div>
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

            <div className="backup-controls-row">
              <button className="backup-action-button export-button" onClick={export_data}>
                export backup file
              </button>

              <label className="backup-action-button import-button">
                import backup file
                <input
                  type="file"
                  accept=".json"
                  onChange={import_data}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

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
            on_add_note={(text) => {
              const key = `week${current_week}`;
              set_notes(prev => ({
                ...prev,
                [key]: [...(prev[key] || []), { text: text, date: new Date().toLocaleString() }]
              }));
            }}

            on_delete_note={(weekKey, noteIndex) => {
              set_notes(prev => {
                const updatedWeekNotes = (prev[weekKey] || []).filter((_, index) => index !== noteIndex);
                return {
                  ...prev,
                  [weekKey]: updatedWeekNotes
                };
              });
            }}
          />
        )}
      </main>
    </div>
  );
}
