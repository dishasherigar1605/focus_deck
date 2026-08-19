(() => {
  'use strict';

  // ----- Timer setup -----
  const DURATIONS = {
    focus: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
  };

  const MODE_LABELS = {
    focus: 'Focus session',
    short: 'Short break',
    long: 'Long break',
  };

  const MODE_ACCENT = {
    focus: '#E8A33D',
    short: '#4FA98C',
    long: '#4FA98C',
  };

  const RING_CIRCUMFERENCE = 678.6;
  const SESSIONS_PER_CYCLE = 4;

  const timeDisplay = document.getElementById('timeDisplay');
  const sessionLabel = document.getElementById('sessionLabel');
  const ringProgress = document.querySelector('.ring-progress');
  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const skipBtn = document.getElementById('skipBtn');
  const modeTabs = document.querySelectorAll('.mode-tab');
  const tallyDots = document.getElementById('tallyDots');

  let mode = 'focus';
  let remaining = DURATIONS.focus;
  let timerId = null;
  let isRunning = false;
  let sessionsCompleted = 0;

  ringProgress.style.strokeDasharray = String(RING_CIRCUMFERENCE);

  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function renderTally() {
    tallyDots.innerHTML = '';
    const filled = sessionsCompleted % SESSIONS_PER_CYCLE === 0 && sessionsCompleted > 0
      ? SESSIONS_PER_CYCLE
      : sessionsCompleted % SESSIONS_PER_CYCLE;
    for (let i = 0; i < SESSIONS_PER_CYCLE; i++) {
      const dot = document.createElement('span');
      if (i < filled) dot.classList.add('is-filled');
      tallyDots.appendChild(dot);
    }
  }

  function updateDisplay() {
    timeDisplay.textContent = formatTime(remaining);
    sessionLabel.textContent = MODE_LABELS[mode];
    const total = DURATIONS[mode];
    const progressFraction = 1 - remaining / total;
    ringProgress.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - progressFraction));
    ringProgress.style.stroke = MODE_ACCENT[mode];
    document.title = `${formatTime(remaining)} · ${MODE_LABELS[mode]}`;
  }

  function setMode(newMode, { resetOnly = false } = {}) {
    mode = newMode;
    remaining = DURATIONS[mode];
    if (!resetOnly) {
      stopTimer();
    }
    modeTabs.forEach((tab) => {
      const active = tab.dataset.mode === mode;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
    updateDisplay();
  }

  function tick() {
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      updateDisplay();
      handleSessionComplete();
      return;
    }
    updateDisplay();
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    startBtn.textContent = 'Pause';
    startBtn.classList.add('is-running');
    timerId = setInterval(tick, 1000);
  }

  function stopTimer() {
    isRunning = false;
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('is-running');
  }

  function handleSessionComplete() {
    stopTimer();
    if (mode === 'focus') {
      sessionsCompleted += 1;
      renderTally();
      const nextMode = sessionsCompleted % SESSIONS_PER_CYCLE === 0 ? 'long' : 'short';
      setMode(nextMode, { resetOnly: true });
    } else {
      setMode('focus', { resetOnly: true });
    }
  }

  startBtn.addEventListener('click', () => {
    if (isRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  resetBtn.addEventListener('click', () => {
    setMode(mode);
  });

  skipBtn.addEventListener('click', () => {
    if (mode === 'focus') {
      setMode('short');
    } else {
      setMode('focus');
    }
  });

  modeTabs.forEach((tab) => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  updateDisplay();
  renderTally();

  // ----- Task list -----
  const taskForm = document.getElementById('taskForm');
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const taskEmpty = document.getElementById('taskEmpty');
  const taskCount = document.getElementById('taskCount');

  let tasks = [];
  let nextId = 1;

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.done ? ' is-done' : '');

      const check = document.createElement('button');
      check.type = 'button';
      check.className = 'task-check' + (task.done ? ' is-checked' : '');
      check.setAttribute('aria-label', task.done ? 'Mark as not done' : 'Mark as done');
      check.innerHTML = '<svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="#171F29" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      check.addEventListener('click', () => {
        task.done = !task.done;
        renderTasks();
      });

      const text = document.createElement('span');
      text.className = 'task-text';
      text.textContent = task.text;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'task-remove';
      remove.setAttribute('aria-label', 'Delete task');
      remove.textContent = '✕';
      remove.addEventListener('click', () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        renderTasks();
      });

      li.appendChild(check);
      li.appendChild(text);
      li.appendChild(remove);
      taskList.appendChild(li);
    });

    const openCount = tasks.filter((t) => !t.done).length;
    taskCount.textContent = `${openCount} open`;
    taskEmpty.classList.toggle('is-hidden', tasks.length > 0);
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = taskInput.value.trim();
    if (!value) return;
    tasks.push({ id: nextId++, text: value, done: false });
    taskInput.value = '';
    renderTasks();
    taskInput.focus();
  });

  renderTasks();
})();
