# Focus Deck

A Pomodoro-style focus timer paired with a lightweight task list — built with plain HTML, CSS, and JavaScript. No frameworks, no build step, no dependencies.

![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-E8A33D)
![No dependencies](https://img.shields.io/badge/dependencies-none-4FA98C)

## Features

- *Circular ring timer* with three modes — Focus (25 min), Short break (5 min), Long break (15 min)
- *Auto-advancing cycle* — after 4 focus sessions, it rolls into a long break automatically
- *Session tally* — a dot tracker shows how many focus sessions you've completed today
- *Built-in task list* — add, check off, and delete tasks right next to the timer
- Responsive layout, visible keyboard focus states, and prefers-reduced-motion support

## Getting started

No installation needed. Clone the repo and open index.html in any browser:

bash
git clone https://github.com/Hitarth-Saparia/focus-deck.git
cd focus-deck
open index.html   # or just double-click the file


## Project structure


focus-deck/
├── index.html   # markup
├── style.css    # layout, theme, ring animation
└── script.js    # timer logic + task list behavior


## Notes

- Tasks and session counts are kept in memory only — they reset when the tab is closed or refreshed. There's no localStorage or backend involved.
- Timer durations are set in script.js under the DURATIONS object if you want to customize them.

## License

No license set yet — add one if you'd like others to reuse this freely.
