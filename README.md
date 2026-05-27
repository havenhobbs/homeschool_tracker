# homeschooling tracker
a clean, responsive, and distraction-free React appliation built with Vite and Vanilla CSS to help parents map out weekly lesson plans, log narrative observations, and visualize instructional momentum over a 52-week timeline

---

## core features

* **dynamic weekly planner:** switch between active academic weeks to manage checkboxes for 6 core subjects across a standard monday-friday configuration
* **contribution grid:** an interactive visual matrix tracking completion intensity over 52 calendar weeks - click any tile to instantly leap to that week's log
* **orton-gillingham checklist:** a non-sequential skill progression matrix that tracks reading/phonics landmarks out of order as your student hits milestones
* **historical archive notes log:** capture breakthroughs, struggles, and general observations bound to the current week while maintaining a unified, readable historical feed below - includes date and time stamp at time of entry but can move between weeks to add if something was missed
* **local storage synchronization:** automatically handles background caching for continuous operational memory - no databases required

---

## file architecture

the repository is modularized to separate your application tracking logic from visual rendering templates: 

```text
homeschool_tracker/
├── src/
│   ├── App.jsx             # Main router, storage engines, and core data stores
│   ├── App.css             # Unified application aesthetics layout rules
│   ├── main.jsx            # React root application bootstrap mounts
│   └── components/
│       ├── WeekNav.jsx         # Previous / Next week context nav timeline bars
│       ├── ProgressMatrix.jsx  # 24-week multi-intensity grid contribution panel
│       ├── SubjectCard.jsx     # Course action blocks housing day selection buttons
│       ├── ProgressBar.jsx     # Reusable geometric metric completion visual indicators
│       ├── Notes.jsx           # Observation logs capturing text feeds and archived sheets
│       └── OGProgress.jsx      # Non-sequential reading milestones check list matrix
```

---

## installation and setup

ensure you have [Node.js](https://nodejs.org) installd, then execute the following terminal routines inside your project root to run or distribute the interface: 

### 1. install dependencies

```bash
npm install
```

### 2. launch local environment (Vite dev server)

```bash
npm run dev
```
*open your browser and navigate to the address listed in your terminal (typically `http://localhost:xxxx/)*

---

## techinical highlights

* **state management:** state variables live strictly in the root parent container (`App.jsx`) and pour context down into functional sub-components via **one-way data props**
* **performance optimization:** component text-box fields isolate internal input strokes cleanly to localized scopes, eliminating cross-component layout rendering lags during notation routines
* **encapsulated formatting:** leverages a lightweight footprint by utiliizing highly cached web standard fonts (`Lexend`) and pure CSS asset sheets rather than massive framework wrapper systems

---

## future roadmap ideas

* **print view layout styles:** injected media queries to instantly format layout pages into stylized printable PDF sheets for state compliance record portfolios

* **light / dark theme toggles:** standard responsive layout style adjustments mapped to background color preferences for optimal screen usage during early morning hours
