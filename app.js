const app = document.querySelector("#app"),
    modalRoot = document.querySelector("#modal-root");

const icons = {
    overview: "◫",
    tasks: "▤",
    schedule: "▦",
    tools: "✦",
    library: "▣",
    profile: "◉",
    settings: "⚙",
};

let state = {
    screen: "landing",
    auth: "login",
    user: JSON.parse(localStorage.getItem("idealibUser") || "null"),
    tasks: JSON.parse(localStorage.getItem("idealibTasks") || "null") || [
        {
            title: "Cellular respiration lab report",
            course: "Biology 204",
            date: "Today · 8:00 PM",
            due: "Today",
        },
        {
            title: "Read chapter 7: Mendelian genetics",
            course: "Biology 204",
            date: "Tomorrow · 10:00 AM",
            due: "Tomorrow",
        },
        {
            title: "World history source analysis",
            course: "HIST 110",
            date: "Friday · 11:59 PM",
            due: "Fri",
        },
    ],
    completed: JSON.parse(localStorage.getItem("idealibDone") || "[]"),
    streak: Number(localStorage.getItem("idealibStreak") || "4"),
    interactionDay: localStorage.getItem("idealibDay") || "",
    featuresToday: Number(localStorage.getItem("idealibFeatures") || "0"),
    timer: 1500,
    timerRunning: false,
    timerInterval: null,
    libraryTab: "notes",
    flashIndex: 0,
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
};
const notes = [
    [
        "BIO 204",
        "Cell Membranes & Transport",
        "The phospholipid bilayer is selectively permeable. Small nonpolar molecules diffuse directly; ions and larger polar molecules rely on transport proteins.",
    ],
    [
        "BIO 204",
        "Mitosis: Key Stages",
        "Prophase condenses chromatin; metaphase aligns chromosomes; anaphase separates sister chromatids; telophase reforms nuclei.",
    ],
    [
        "HIST 110",
        "The Silk Roads",
        "A network of routes linked East Asia, Central Asia, and the Mediterranean. Trade also moved ideas, technologies, and disease.",
    ],
    [
        "BIO 204",
        "Enzyme Kinetics",
        "Enzymes lower activation energy without changing reaction equilibrium. Competitive inhibitors bind an active site and can be overcome with substrate.",
    ],
    [
        "HIST 110",
        "Primary Source: Magna Carta",
        "The 1215 charter limited royal authority and established that the king was subject to the law, influencing later constitutional ideas.",
    ],
    [
        "BIO 204",
        "DNA Replication",
        "DNA polymerase synthesizes new strands 5′ to 3′. The leading strand is continuous; the lagging strand forms Okazaki fragments.",
    ],
];
function esc(s = "") {
    return String(s).replace(
        /[&<>"']/g,
        (c) =>
            ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
                c
                ],
    );
}
function brand() {
    return `<a class="brand" href="#" onclick="go('landing');return false"><span class="brandmark">i</span>IdeaLib</a>`;
}
function render() {
    if (state.screen === "landing") renderLanding();
    else if (state.screen === "auth") renderAuth();
    else renderApp();
}
function renderLanding() {
    app.innerHTML = `<div class="landing"><header class="topbar">${brand()}<nav class="navlinks"><a href="#features">What we offer</a><a href="#preview">How it works</a><a href="#plans">Subscription</a></nav><div class="navactions"><button class="btn light small" onclick="openAuth('login')">Log in</button><button class="btn small" onclick="openAuth('register')">Sign up</button></div></header><section class="hero"><div class="hero-content"><div class="eyebrow">Your calm corner for college</div><h1>Learn. Organize.<br>Share.</h1><p>An all-in-one academic space for your notes, deadlines, course plans, and study tools—so you can spend less time switching apps and more time understanding.</p><div class="hero-actions"><button class="btn" onclick="openAuth('register')">Start for free&nbsp; →</button><button class="btn light" onclick="document.querySelector('#features').scrollIntoView({behavior:'smooth'})">Explore IdeaLib</button></div><div class="hero-note">A little more focus. A lot less juggling.</div></div></section><section class="features" id="features"><div class="eyebrow">Everything in one place</div><h2 class="section-title">Everything you need, nothing you don’t</h2><p class="section-sub">Thoughtful tools to help your study routine feel lighter.</p><div class="feature-grid"><article class="feature-card"><div class="feature-icon">▤</div><h3>Study Tools</h3><p>Summarize PDFs, generate quizzes, and turn your notes into flashcards.</p></article><article class="feature-card"><div class="feature-icon">☑</div><h3>Task Management</h3><p>Keep deadlines in view with a satisfying, flexible task board.</p></article><article class="feature-card"><div class="feature-icon">▦</div><h3>Course Planner</h3><p>Bring classes, exams, and study sessions into one clear schedule.</p></article><article class="feature-card"><div class="feature-icon">↗</div><h3>Progress & Focus</h3><p>See your momentum grow with gentle progress cues and focus sessions.</p></article></div><div class="preview" id="preview"><div><div class="eyebrow">A peek inside your workspace</div><h2>Your home to academic shifts.</h2><p>Open one calm workspace for your weekly priorities, progress, and study sessions. Create an account to explore the prototype with saved tasks and notes.</p><button class="btn" onclick="openAuth('register')">Try IdeaLib free</button></div><div class="mini-dashboard"><div class="mini-top"><span>Progress overview</span><span>Week 06</span></div><small>Cell Biology <b style="float:right">72%</b></small><div class="mini-bar"><span></span></div><small>World History <b style="float:right">48%</b></small><div class="mini-bar"><span style="width:48%"></span></div><small>2 tasks due this week · 4 day streak</small></div></div></section><section class="plans" id="plans"><div class="eyebrow">Simple plans, room to grow</div><h2 class="section-title">Your study rhythm, your plan</h2><div class="plan-grid"><div class="plan"><span class="eyebrow">Free</span><div class="price">₱0 <small style="font:14px 'DM Sans'">/ month</small></div><ul><li>Notes and task tracker</li><li>One PDF summary each week</li><li>Basic focus timer</li></ul><button class="btn light" onclick="openAuth('register')">Start free</button></div><div class="plan featured"><span class="eyebrow">IdeaLib Duo</span><div class="price">₱159 <small style="font:14px 'DM Sans'">/ month</small></div><ul><li>Everything in Free</li><li>Course planner and study tools</li><li>Unlimited quizzes and flashcards</li><li>Create a study group</li></ul><button class="btn" onclick="openAuth('register');setTimeout(()=>showToast('Upgrade options are available in your profile.'),250)">Explore Duo</button></div></div></section><footer class="footer">IdeaLib · Learn, Organize, and Share</footer></div>`;
}
function openAuth(which) {
    state.screen = "auth";
    state.auth = which;
    render();
}
function renderAuth() {
    let register = state.auth === "register";
    app.innerHTML = `<div class="auth-view">${brand()}<div class="auth-card">${register ? `<div class="auth-form"><div class="eyebrow">Start your study space</div><h1>Create your account</h1><p>One organized home for everything you're learning.</p><form onsubmit="submitAuth(event,'register')"><div class="field"><label>Email</label><input name="email" type="email" placeholder="you@college.edu" required></div><div class="field"><label>Username</label><input name="username" placeholder="Your name" minlength="2" required></div><div class="field"><label>Password</label><input name="password" type="password" placeholder="At least 6 characters" minlength="6" required></div><div class="field"><label>Confirm password</label><input name="confirm" type="password" placeholder="Repeat your password" minlength="6" required></div><div id="auth-error" class="auth-error"></div><button class="btn" style="width:100%">Create free account</button></form><div class="auth-switch">Already have an account? <button class="linkbutton" onclick="openAuth('login')">Log in</button></div></div><aside class="auth-art">${brand()}<p>Make room for the ideas that move you forward.</p><span class="eyebrow" style="color:#fff">Learn · Organize · Share</span></aside>` : `<aside class="auth-art">${brand()}<p>One little step toward a calmer study week.</p><span class="eyebrow" style="color:#fff">Learn · Organize · Share</span></aside><div class="auth-form"><div class="eyebrow">Welcome back</div><h1>Log in to IdeaLib</h1><p>Your ideas and plans are right where you left them.</p><form onsubmit="submitAuth(event,'login')"><div class="field"><label>Username or email</label><input name="identity" placeholder="Enter your username" required></div><div class="field"><label>Password</label><input name="password" type="password" placeholder="Enter your password" required></div><div id="auth-error" class="auth-error"></div><button class="btn" style="width:100%">Log in</button></form><div class="auth-switch">Don't have an account? <button class="linkbutton" onclick="openAuth('register')">Create account</button></div></div>`}</div></div>`;
}
function submitAuth(e, type) {
    e.preventDefault();
    let f = new FormData(e.target);
    if (type === "register") {
        if (f.get("password") !== f.get("confirm")) {
            document.querySelector("#auth-error").textContent =
                "Those passwords don’t match yet.";
            return;
        }
        state.user = {
            name: f.get("username").trim(),
            email: f.get("email"),
            password: f.get("password"),
            plan: "Free",
        };
        localStorage.setItem("idealibUser", JSON.stringify(state.user));
        showToast("Your IdeaLib account is ready.");
    } else {
        let identity = f.get("identity").trim().toLowerCase(),
            saved = state.user;
        if (
            !saved ||
            ![saved.name.toLowerCase(), saved.email.toLowerCase()].includes(
                identity,
            ) ||
            saved.password !== f.get("password")
        ) {
            document.querySelector("#auth-error").textContent =
                "We couldn’t match those details. Create an account or check your username and password.";
            return;
        }
        showToast(`Welcome back, ${saved.name}!`);
    }
    state.screen = "overview";
    render();
}
function go(screen) {
    state.screen = screen;
    render();
    if (!["landing", "auth"].includes(screen)) trackInteraction();
}
function trackInteraction() {
    let day = new Date().toDateString();
    if (state.interactionDay !== day) {
        state.interactionDay = day;
        state.featuresToday = 0;
        localStorage.setItem("idealibDay", day);
    }
    state.featuresToday++;
    localStorage.setItem("idealibFeatures", state.featuresToday);
    if (
        state.featuresToday >= 3 &&
        localStorage.getItem("idealibStreakDay") !== day
    ) {
        state.streak++;
        localStorage.setItem("idealibStreak", state.streak);
        localStorage.setItem("idealibStreakDay", day);
        showToast(`Study streak increased to ${state.streak} days ✨`);
    }
}
function renderApp() {
    let current = state.screen;
    let names = {
        overview: "Overview",
        library: "My Library",
        tasks: "Task Tracker",
        schedule: "Schedule",
        tools: "Study Tools",
        profile: "Profile",
    };
    app.innerHTML = `<div class="app-shell"><aside class="sidebar ${state.user?.plan === "Duo" ? "duo-plan" : ""}" id="sidebar"><div class="side-brand">${brand()}</div><div class="side-label">My Library</div><nav class="side-nav"><button class="${current === "library" && state.libraryTab !== "flashcards" ? "active" : ""}" onclick="state.libraryTab='notes';go('library')"><span class="nav-ico">${icons.library}</span>Notes</button><button class="${current === "library" && state.libraryTab === "flashcards" ? "active" : ""}" onclick="go('library');state.libraryTab='flashcards';renderApp()"><span class="nav-ico">▱</span>Flashcards</button></nav><div class="side-label">Workspace</div><nav class="side-nav">${[
        ["overview", "Overview"],
        ["tasks", "Task tracker"],
        ["schedule", "Course planner"],
        ["tools", "Study tools"],
    ]
        .map(
            ([id, l]) =>
                `<button class="${current === id ? "active" : ""}" onclick="go('${id}')"><span class="nav-ico">${icons[id]}</span>${l}${["schedule", "tools"].includes(id) && state.user?.plan !== "Duo" ? '<span style="margin-left:auto;font-size:9px;color:#99799d">DUO</span>' : ""}</button>`,
        )
        .join(
            "",
        )}</nav><div class="side-foot"><div class="upgrade-mini"><b>Study better together</b><p>Unlock planning tools and make a study group with Duo.</p><button class="btn small" onclick="upgrade()">Upgrade to Duo</button></div><div class="user-mini" onclick="go('profile')"><div class="avatar">${esc((state.user?.name || "S").charAt(0).toUpperCase())}</div><div><b>${esc(state.user?.name || "Student")}</b><small>${esc(state.user?.plan || "Free")} plan · Profile</small></div></div></div></aside><main class="main"><header class="app-top"><div><button class="iconbtn menu-toggle" onclick="document.querySelector('#sidebar').classList.toggle('open')">☰</button><div class="breadcrumb">WORKSPACE&nbsp; / &nbsp;${names[current]?.toUpperCase() || "OVERVIEW"}</div><h1 class="app-heading">${current === "overview" ? "Make today count." : names[current]}</h1><p class="subtitle">${current === "overview" ? "A softer way to stay on top of your semester." : pageSubtitle(current)}</p></div><div class="top-right"><input class="search" placeholder="⌕  Search your space" oninput="searchItems(this.value)"><div class="streak-pill">✦ ${state.streak} day streak</div></div></header>${screenBody(current)}</main></div>`;
}
function pageSubtitle(s) {
    return (
        {
            library: "Your notes and the ideas you want to keep.",
            tasks: "Small steps, visible progress.",
            schedule: "Your classes, exams, and study blocks.",
            tools: "A little help for your next study session.",
            profile: "Your student space and subscription.",
        }[s] || ""
    );
}
function screenBody(s) {
    if (s === "overview") return overview();
    if (s === "library") return library();
    if (s === "tasks") return tasksPage();
    if (s === "schedule") return schedule();
    if (s === "tools") return tools();
    if (s === "profile") return profile();
    return overview();
}
function overview() {
    let open = state.tasks.filter((_, i) => !state.completed.includes(i));
    return `<div class="action-row"><button class="btn" onclick="newNote()">＋ New note</button><button class="btn light" onclick="go('tools')">⇧ Scan PDF</button><button class="btn light" onclick="addTask()">＋ Add assignment</button><button class="btn light" onclick="go('library')">Open library</button></div><div class="stats"><div class="stat"><span>TASKS THIS WEEK</span><b>${state.completed.length}/${state.tasks.length + 2}</b></div><div class="stat"><span>UPCOMING</span><b>${open.length}</b></div><div class="stat"><span>STUDY STREAK</span><b>${state.streak} <small style="font-size:12px">days</small></b></div></div><div class="dashboard-grid"><section class="card"><div class="card-head"><h3>Progress overview</h3><span class="eyebrow">Spring semester</span></div>${[
        ["Cell Biology", "72%", "72"],
        ["World History", "48%", "48"],
        ["Chemistry Lab", "86%", "86"],
    ]
        .map(
            (x) =>
                `<div class="progress-row"><div class="progress-label"><b>${x[0]}</b><span>${x[1]}</span></div><div class="progress-track"><div class="progress-fill" style="width:${x[2]}%"></div></div></div>`,
        )
        .join(
            "",
        )}<button class="linkbutton" onclick="go('schedule')">View course planner →</button></section><section class="card"><div class="card-head"><h3>Upcoming deadlines</h3><button class="linkbutton" onclick="go('tasks')">See all</button></div>${open.length ? state.tasks.map((t, i) => (state.completed.includes(i) ? "" : `<label class="week-item"><input type="checkbox" onchange="toggleTask(${i})"><span><b>${esc(t.title)}</b><small>${esc(t.course)}</small></span><span class="due ${t.due === "Today" ? "soon" : ""}">${esc(t.due)}</span></label>`)).join("") : '<p class="subtitle">All caught up. Enjoy the breathing room ✨</p>'}</section></div><div class="bottom-grid"><section class="card timer-card"><div><span class="eyebrow" style="color:#e4cee5">FOCUS SESSION · POMODORO</span><h3>Ready for a deep dive?</h3><div class="timer-num" id="timer-num">${formatTime(state.timer)}</div></div><div class="timer-controls"><button onclick="toggleTimer()" id="timer-button">${state.timerRunning ? "Pause" : "Start focus"}</button><button onclick="resetTimer()">Reset</button><button onclick="go('tools')">Timer settings</button></div></section><section class="card"><div class="card-head"><h3>This week</h3><span class="eyebrow">Your momentum</span></div><ul class="activity-list"><li><span class="dot"></span>Biology notes updated <span style="margin-left:auto;color:var(--muted)">Today</span></li><li><span class="dot" style="background:#d3a878"></span>2 tasks coming up <span style="margin-left:auto;color:var(--muted)">This week</span></li><li><span class="dot" style="background:#91a48c"></span>Focus time: 3h 25m <span style="margin-left:auto;color:var(--muted)">Weekly</span></li></ul></section></div>`;
}
function library() {
    return `<div class="page-content"><div class="tabs"><button class="${state.libraryTab === "notes" ? "active" : ""}" onclick="state.libraryTab='notes';renderApp()">Notes</button><button class="${state.libraryTab === "flashcards" ? "active" : ""}" onclick="state.libraryTab='flashcards';renderApp()">Flashcards</button></div>${state.libraryTab === "notes" ? `<div class="note-actions"><button class="btn small" onclick="newNote()">＋ New note</button><button class="btn light small" onclick="manageSubjects()">Manage subjects</button><button class="btn light small" onclick="createQuiz()">✦ Create quiz from selected notes</button></div><div class="notes-grid" id="notes-grid">${notes.map((n, i) => `<article class="note-card"><input type="checkbox" class="note-select" aria-label="Select ${esc(n[1])}"><span class="tag">${n[0]}</span><h3>${n[1]}</h3><p>${n[2]}</p></article>`).join("")}</div>` : state.user?.plan !== "Duo" ? locked("Flashcards", "Turn your course notes into a quick, reusable review deck. Upgrade to Duo to unlock flashcards.") : `<div class="flashcard" onclick="flipFlashcard()"><div><div class="eyebrow">CARD ${state.flashIndex + 1} OF 4 · CLICK TO FLIP</div><h2 id="flash-text">${esc(flashcards[state.flashIndex].q)}</h2><p id="flash-hint">Tap to reveal the answer</p></div></div><div style="display:flex;justify-content:center;gap:9px"><button class="btn light small" onclick="event.stopPropagation();changeFlash(-1)">← Previous</button><button class="btn small" onclick="event.stopPropagation();changeFlash(1)">Next card →</button><button class="btn light small" onclick="createQuiz()">Create quiz</button></div>`}</div>`;
}
const flashcards = [
    {
        q: "What is the role of the phospholipid bilayer?",
        a: "It forms a selectively permeable boundary around the cell.",
    },
    { q: "Which phase aligns chromosomes at the cell equator?", a: "Metaphase." },
    {
        q: "What does DNA polymerase do?",
        a: "Synthesizes a new DNA strand in the 5′ to 3′ direction.",
    },
    {
        q: "How do competitive inhibitors affect enzymes?",
        a: "They bind to the active site; adding substrate can reduce their effect.",
    },
];
let flashFlipped = false;
function tasksPage() {
    return `<div class="action-row"><button class="btn" onclick="addTask()">＋ Add task</button><button class="btn light small" onclick="manageSubjects()">Manage subjects</button><span class="eyebrow" style="align-self:center">${state.tasks.length - state.completed.length} tasks to do</span></div><div class="task-board">${state.tasks.map((t, i) => `<article class="task-sticky ${state.completed.includes(i) ? "done" : ""}"><button class="remove-task" style="position:absolute;right:12px;top:8px" onclick="removeTask(${i})" aria-label="Remove task">×</button><label><input type="checkbox" ${state.completed.includes(i) ? "checked" : ""} onchange="toggleTask(${i})"> <span class="eyebrow">${esc(t.course)}</span></label><h3>${esc(t.title)}</h3><p>Keep this on your radar and make a little progress today.</p><footer><span>${esc(t.date)}</span><span>${state.completed.includes(i) ? "Done ✓" : "To do"}</span></footer></article>`).join("")}</div>`;
}
function schedule() {
    if (state.user?.plan !== "Duo")
        return locked(
            "Course planner",
            "Plan your classes, exams, and study blocks in one flexible calendar. Upgrade to Duo to unlock the course planner.",
        );
    let first = new Date(state.year, state.month, 1),
        start = (first.getDay() + 6) % 7,
        days = new Date(state.year, state.month + 1, 0).getDate(),
        cells = Array.from({ length: 42 }, (_, i) => {
            let d = i - start + 1;
            return `<div class="cal-cell">${d > 0 && d <= days ? d : ""}${d === 3 ? '<span class="cal-event">9:00 Biology lecture</span>' : ""}${d === 5 ? '<span class="cal-event exam">Biology midterm · 2 PM</span>' : ""}${d === 9 ? '<span class="cal-event">History seminar</span>' : ""}${d === 13 ? '<span class="cal-event exam">Chem lab report</span>' : ""}${d === 18 ? '<span class="cal-event">Study group</span>' : ""}</div>`;
        }).join("");
    return `<div class="card"><div class="calendar-toolbar"><button class="iconbtn" onclick="changeMonth(-1)">←</button><h3 style="margin:0">${new Date(state.year, state.month).toLocaleString("en", { month: "long", year: "numeric" })}</h3><button class="iconbtn" onclick="changeMonth(1)">→</button></div><div class="calendar-grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<div class="cal-cell head">${d}</div>`).join("")}${cells}</div></div>`;
}
function tools() {
    if (state.user?.plan !== "Duo")
        return locked(
            "Study tools",
            "Summarize PDFs, build quizzes, and create flashcards directly from your course materials. Upgrade to Duo to unlock these tools.",
        );
    return `<div class="tool-grid"><section class="tool-card"><div class="eyebrow">YOUR MATERIALS</div><h3>Shared course PDFs</h3><p>Keep class handouts and lecture notes together.</p>${["Biology_204_Week_06.pdf", "History_Primary_Sources.pdf", "Chemistry_Lab_Guide.pdf"].map((f) => `<div class="file-row"><span>▧ &nbsp;${f}</span><button class="linkbutton" onclick="showToast('Preview ready: ${f}')">Open</button></div>`).join("")}<button class="btn light small" onclick="uploadPdf()">＋ Add PDF</button> <button class="btn light small" onclick="scanPdf()">⌕ Scan PDF</button></section><section class="tool-card"><div class="eyebrow">AI STUDY ASSISTANT</div><h3>PDF summarizer</h3><p>Turn a long reading into a concise, reviewable outline.</p><button class="btn small" onclick="summarizePdf()">＋ Make a PDF summary</button><div id="summary-result"></div></section><section class="tool-card"><div class="eyebrow">ACTIVE RECALL</div><h3>Quiz & flashcards</h3><p>Practice what you know or review a set of biology cards.</p><button class="btn small" onclick="createQuiz()">Generate a quick quiz</button> <button class="btn light small" onclick="go('library');state.libraryTab='flashcards';renderApp()">View flashcards</button></section><section class="tool-card"><div class="eyebrow">FOCUS TIMER</div><h3>Make a little space</h3><div class="field"><label>Session style</label><select id="timer-style" onchange="setTimerStyle(this.value)" style="padding:10px;border:1px solid var(--line);border-radius:10px"><option value="25">Pomodoro · 25 min</option><option value="50">Deep focus · 50 min</option><option value="15">Short sprint · 15 min</option></select></div><div class="custom-timer"><div class="field"><label for="custom-hours">Hours</label><input id="custom-hours" type="number" min="0" max="12" value="0" inputmode="numeric"></div><div class="field"><label for="custom-minutes">Minutes</label><input id="custom-minutes" type="number" min="0" max="59" value="25" inputmode="numeric"></div><div class="field"><label for="custom-seconds">Seconds</label><input id="custom-seconds" type="number" min="0" max="59" value="0" inputmode="numeric"></div><button class="btn light small" onclick="setCustomTimer()">Set</button></div><div class="timer-num" style="color:var(--purple);font-size:36px" id="timer-num">${formatTime(state.timer)}</div><div class="timer-controls"><button class="btn small" onclick="toggleTimer()" id="timer-button">${state.timerRunning ? "Pause" : "Start"}</button><button class="btn light small" onclick="resetTimer()">Reset</button></div></section></div>`;
}
function locked(title, desc) {
    return `<div class="card page-content" style="text-align:center;padding:60px 25px"><div class="feature-icon" style="margin:0 auto 18px">✦</div><div class="eyebrow">A little more room to grow</div><h2 class="section-title" style="font-size:30px;margin:12px 0">${title} is part of Duo</h2><p style="max-width:490px;margin:0 auto 23px;color:var(--muted);line-height:1.7">${desc}</p><button class="btn" onclick="upgrade()">Explore IdeaLib Duo · ₱159/month</button><p style="font-size:11px;margin-top:17px">Your notes, tasks, and basic focus timer stay on Free.</p></div>`;
}
function profile() {
    let u = state.user || {
        name: "Student",
        email: "student@example.com",
        plan: "Free",
    };
    return `<div class="profile-banner"></div><section class="profile-card"><div class="profile-head"><div class="profile-avatar">${esc(u.name.charAt(0).toUpperCase())}</div><div><h2>${esc(u.name)}</h2><div class="subtitle">${esc(u.email)}</div></div><button class="btn light small" style="margin-left:auto" onclick="editProfile()">Edit profile</button></div><div class="profile-fields"><div class="profile-field"><small>FULL NAME</small><b>${esc(u.name)}</b></div><div class="profile-field"><small>EMAIL ADDRESS</small><b>${esc(u.email)}</b></div><div class="profile-field"><small>STUDENT STATUS</small><b>Undergraduate student</b></div><div class="profile-field"><small>STUDY STREAK</small><b>✦ ${state.streak} days and counting</b></div></div></section><section class="card"><div class="card-head"><h3>Subscription</h3><span class="tag">${esc(u.plan || "Free")}</span></div><p class="subtitle" style="margin:0 0 14px">${u.plan === "Duo" ? "You have access to course planning, study tools, and study groups." : "Your free plan includes notes, tasks, and a basic focus timer."}</p>${u.plan === "Duo" ? '<button class="btn light small" onclick="showToast(\'Duo is active in this prototype.\')">Manage plan</button>' : '<button class="btn small" onclick="upgrade()">Upgrade to Duo · ₱159/month</button>'} <button class="linkbutton" style="float:right" onclick="logout()">Log out</button></section>`;
}
function showModal(html) {
    modalRoot.innerHTML = `<div class="modal-backdrop" onclick="if(event.target===this)closeModal()"><section class="modal"><button class="modal-close" onclick="closeModal()">×</button>${html}</section></div>`;
}
function closeModal() {
    modalRoot.innerHTML = "";
}
function showToast(msg) {
    let root = document.querySelector("#toast-root");
    root.innerHTML = `<div class="toast">${esc(msg)}</div>`;
    setTimeout(() => (root.innerHTML = ""), 2800);
}
function addTask() {
    showModal(
        `<h2>Add an assignment</h2><p>Give your next step a home.</p><form onsubmit="saveTask(event)"><div class="field"><label>Assignment or task</label><input name="title" required placeholder="e.g. Review lecture notes"></div><div class="field"><label>Course</label><input name="course" required placeholder="e.g. Biology 204"></div><div class="field"><label>Due</label><input name="date" required placeholder="e.g. Thursday · 5:00 PM"></div><button class="btn">Add to my list</button></form>`,
    );
}
function saveTask(e) {
    e.preventDefault();
    let f = new FormData(e.target);
    state.tasks.unshift({
        title: f.get("title"),
        course: f.get("course"),
        date: f.get("date"),
        due: "Soon",
    });
    persistTasks();
    closeModal();
    renderApp();
    trackInteraction();
    showToast("Assignment added to your week.");
}
function removeTask(i) {
    state.tasks.splice(i, 1);
    state.completed = state.completed
        .filter((x) => x !== i)
        .map((x) => (x > i ? x - 1 : x));
    persistTasks();
    renderApp();
    showToast("Task removed.");
}
function toggleTask(i) {
    if (state.completed.includes(i))
        state.completed = state.completed.filter((x) => x !== i);
    else state.completed.push(i);
    localStorage.setItem("idealibDone", JSON.stringify(state.completed));
    renderApp();
    trackInteraction();
    showToast(
        state.completed.includes(i)
            ? "Nice work. One less thing on your list."
            : "Task moved back to your list.",
    );
}
function persistTasks() {
    localStorage.setItem("idealibTasks", JSON.stringify(state.tasks));
    localStorage.setItem("idealibDone", JSON.stringify(state.completed));
}
function newNote() {
    showModal(
        `<h2>New note</h2><p>Capture a thought before it wanders off.</p><form onsubmit="saveNote(event)"><div class="field"><label>Course</label><input name="course" required placeholder="Biology 204"></div><div class="field"><label>Note title</label><input name="title" required placeholder="A useful idea"></div><div class="field"><label>Your note</label><textarea name="body" rows="4" required placeholder="Write a few lines..." style="padding:12px;border:1px solid var(--line);border-radius:10px"></textarea></div><button class="btn">Save note</button></form>`,
    );
}
function saveNote(e) {
    e.preventDefault();
    let f = new FormData(e.target),
        grid = document.querySelector("#notes-grid");
    if (grid) {
        grid.insertAdjacentHTML(
            "afterbegin",
            `<article class="note-card"><input type="checkbox" class="note-select"><span class="tag">${esc(f.get("course"))}</span><h3>${esc(f.get("title"))}</h3><p>${esc(f.get("body"))}</p></article>`,
        );
    }
    closeModal();
    trackInteraction();
    showToast("Note saved in this session.");
}
function createQuiz() {
    if (state.user?.plan !== "Duo") {
        upgrade();
        return;
    }
    let selected = [...document.querySelectorAll(".note-select:checked")].length;
    if (!selected) {
        showToast("Select one or more notes to make a quiz.");
        return;
    }
    showModal(
        `<div class="eyebrow">QUICK CHECK · BIOLOGY & HISTORY</div><h2>Quiz from your notes</h2><p>Which statement best describes how DNA polymerase builds a new strand?</p><div style="display:grid;gap:9px">${["It builds in the 5′ to 3′ direction.", "It joins amino acids into proteins.", "It dissolves the phospholipid bilayer."].map((x, i) => `<button class="btn light" style="text-align:left" onclick="quizAnswer(${i})">${x}</button>`).join("")}</div><p>Made from ${selected} selected note${selected === 1 ? "" : "s"}.</p>`,
    );
}
function quizAnswer(i) {
    closeModal();
    showToast(
        i === 0
            ? "Correct — nice recall!"
            : "Not quite. Review the DNA replication note and try again.",
    );
    trackInteraction();
}
function upgrade() {
    showModal(
        `<div class="eyebrow">IDEALIB DUO</div><h2>Make space for more</h2><p>Unlock the course planner, PDF summaries, quizzes, flashcards, and study groups for ₱159/month.</p><ul><li>Plan your semester in the calendar</li><li>Summarize course PDFs and create quizzes</li><li>Share a study space with a friend</li></ul><button class="btn" onclick="activateDuo()">Activate Duo in this prototype</button><p style="font-size:10px">Prototype only · no payment will be collected.</p>`,
    );
}
function activateDuo() {
    if (state.user) {
        state.user.plan = "Duo";
        localStorage.setItem("idealibUser", JSON.stringify(state.user));
    }
    closeModal();
    renderApp();
    showToast("Duo unlocked — your study tools are ready!");
    trackInteraction();
}
function editProfile() {
    showModal(
        `<h2>Edit profile</h2><p>Keep your student details up to date.</p><form onsubmit="saveProfile(event)"><div class="field"><label>Name</label><input name="name" required value="${esc(state.user.name)}"></div><div class="field"><label>Email</label><input name="email" type="email" required value="${esc(state.user.email)}"></div><button class="btn">Save profile</button></form>`,
    );
}
function saveProfile(e) {
    e.preventDefault();
    let f = new FormData(e.target);
    state.user.name = f.get("name");
    state.user.email = f.get("email");
    localStorage.setItem("idealibUser", JSON.stringify(state.user));
    closeModal();
    renderApp();
    showToast("Profile updated.");
}
function uploadPdf() {
    showModal(
        `<h2>Add a course PDF</h2><p>Choose a PDF to add to your shared study materials.</p><div class="field"><label>PDF file</label><input id="pdf-file" type="file" accept="application/pdf"></div><button class="btn" onclick="pdfChosen()">Add PDF</button>`,
    );
}
function pdfChosen() {
    let f = document.querySelector("#pdf-file").files[0];
    if (f) {
        closeModal();
        showToast(`${f.name} added to this session.`);
    } else showToast("Choose a PDF file first.");
}
function summarizePdf() {
    showModal(
        `<h2>Make a PDF summary</h2><p>Choose a course PDF and a summary style. This prototype uses sample content to show the result.</p><div class="field"><label>Source PDF</label><select id="summary-source" style="padding:12px;border:1px solid var(--line);border-radius:10px"><option>Biology_204_Week_06.pdf</option><option>History_Primary_Sources.pdf</option></select></div><button class="btn" onclick="makeSummary()">Create summary</button>`,
    );
}
function makeSummary() {
    closeModal();
    let r = document.querySelector("#summary-result");
    if (r)
        r.innerHTML =
            '<div style="background:#f5edf4;padding:13px;border-radius:12px;margin-top:12px"><b style="color:var(--purple);font:600 14px Playfair Display">Summary · Cell Biology</b><p style="font-size:11px;line-height:1.6;color:#756c76">Cell membranes regulate exchange through passive diffusion, facilitated transport, and active transport. ATP-powered pumps move substances against their concentration gradients.</p></div>';
    showToast("Summary created and added to your study tools.");
    trackInteraction();
}
function flipFlashcard() {
    flashFlipped = !flashFlipped;
    document.querySelector("#flash-text").textContent = flashFlipped
        ? flashcards[state.flashIndex].a
        : flashcards[state.flashIndex].q;
    document.querySelector("#flash-hint").textContent = flashFlipped
        ? "Click to see the question"
        : "Tap to reveal the answer";
}
function changeFlash(d) {
    state.flashIndex =
        (state.flashIndex + d + flashcards.length) % flashcards.length;
    flashFlipped = false;
    renderApp();
}
function formatTime(s) {
    return (
        String(Math.floor(s / 60)).padStart(2, "0") +
        ":" +
        String(s % 60).padStart(2, "0")
    );
}
function updateTimerDisplay() {
    document
        .querySelectorAll("#timer-num")
        .forEach((el) => (el.textContent = formatTime(state.timer)));
    document
        .querySelectorAll("#timer-button")
        .forEach(
            (el) => (el.textContent = state.timerRunning ? "Pause" : "Start focus"),
        );
}
function toggleTimer() {
    state.timerRunning = !state.timerRunning;
    if (state.timerRunning) {
        state.timerInterval = setInterval(() => {
            if (state.timer > 0) {
                state.timer--;
                updateTimerDisplay();
            } else {
                clearInterval(state.timerInterval);
                state.timerRunning = false;
                updateTimerDisplay();
                showToast("Focus session complete. Take a little breather!");
            }
        }, 1000);
        trackInteraction();
    } else clearInterval(state.timerInterval);
    updateTimerDisplay();
}
function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.timer =
        Number(document.querySelector("#timer-style")?.value || 25) * 60;
    updateTimerDisplay();
}
function setTimerStyle(m) {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.timer = Number(m) * 60;
    updateTimerDisplay();
}
function changeMonth(d) {
    state.month += d;
    if (state.month < 0) {
        state.month = 11;
        state.year--;
    }
    if (state.month > 11) {
        state.month = 0;
        state.year++;
    }
    renderApp();
}
function searchItems(q) {
    if (state.screen === "library") {
        document
            .querySelectorAll(".note-card")
            .forEach(
                (c) =>
                    (c.style.display = c.textContent
                        .toLowerCase()
                        .includes(q.toLowerCase())
                        ? ""
                        : "none"),
            );
    }
}
function logout() {
    state.user = null;
    localStorage.removeItem("idealibUser");
    state.screen = "landing";
    render();
    showToast("You’re logged out.");
}
const fullNotes = [
    `The plasma membrane is a selectively permeable boundary built primarily from a phospholipid bilayer. Hydrophilic phosphate heads face aqueous environments; hydrophobic fatty-acid tails point inward and create a barrier to most ions and large polar molecules.\n\nPASSIVE TRANSPORT requires no direct ATP input and moves substances down concentration or electrochemical gradients. Simple diffusion moves small nonpolar molecules through the bilayer. Facilitated diffusion uses channels or carriers for ions and polar solutes. Osmosis is net water movement across a selectively permeable membrane.\n\nACTIVE TRANSPORT moves substances against a gradient and requires energy. The sodium-potassium pump uses ATP to move 3 Na⁺ out and 2 K⁺ into an animal cell per cycle. Cotransport can use the energy stored in an ion gradient to move another substance. Endocytosis brings material into a cell in vesicles; exocytosis releases vesicle contents outside.\n\nEXAM CHECK: predict net water movement by comparing solute concentrations; distinguish channel-mediated facilitated diffusion from ATP-driven pumping; explain why membrane proteins determine selective permeability.`,
    `MITOSIS distributes duplicated chromosomes into two genetically similar daughter nuclei. Before mitosis, DNA is replicated during S phase; each chromosome consists of sister chromatids joined at a centromere.\n\nPROPHASE: chromatin condenses and the spindle forms. PROMETAPHASE: the nuclear envelope breaks down and spindle microtubules attach to kinetochores. METAPHASE: chromosomes align at the metaphase plate. ANAPHASE: sister chromatids separate and move to opposite poles. TELOPHASE: chromosomes decondense and nuclear envelopes reform. CYTOKINESIS divides the cytoplasm; a cleavage furrow forms in animal cells and a cell plate in plant cells.\n\nG1, G2, and spindle checkpoints reduce the chance of division with damaged DNA, incomplete replication, or improperly attached chromosomes. Mitosis is nuclear division; cytokinesis is cytoplasmic division.`,
    `The Silk Roads were overlapping land and maritime networks connecting East Asia, Central Asia, South Asia, the Middle East, and the Mediterranean. They were not one road or a single empire's project. Geography, political stability, caravan cities, and maritime technologies shaped routes over time.\n\nMerchants traded high-value goods including silk, spices, ceramics, glassware, and horses. Goods often passed through multiple intermediaries. The routes also carried religions, artistic styles, technologies, diplomatic missions, and pathogens. Buddhism spread into Central and East Asia through monastic communities and patronage.\n\nHISTORICAL METHOD: avoid treating exchange as one-way. Ask who controlled a corridor, which communities mediated exchange, what evidence survives, and how a source's perspective shapes its claims.`,
    `Enzymes increase reaction rates by lowering activation energy. They do not change the reaction's overall free-energy change or equilibrium position. Substrates bind at an active site; induced fit describes conformational adjustment that can stabilize the transition state.\n\nAs substrate concentration rises, rate approaches saturation (Vmax). Km is the substrate concentration at half Vmax in the Michaelis–Menten model. A competitive inhibitor binds the active site: apparent Km increases while Vmax can still be reached at sufficiently high substrate concentration. A pure noncompetitive inhibitor lowers effective activity and Vmax while idealized Km remains constant.\n\nEXAM CHECK: read rate-versus-substrate graphs by locating Vmax and the substrate concentration at half that rate; distinguish competitive from noncompetitive inhibition.`,
    `Magna Carta was agreed in 1215 during conflict between King John and rebellious barons. It addressed grievances about royal taxation, justice, and feudal obligations. The settlement was short-lived, but later reissues and interpretations made it an enduring reference in English constitutional history.\n\nDo not read it as a modern democratic constitution: its immediate beneficiaries were chiefly elites, and its provisions reflected a specific political struggle. Its longer legacy came partly from later readers emphasizing limits on arbitrary power, lawful process, and the idea that rulers were bound by law.\n\nSOURCE ANALYSIS: identify authoring parties, audience, purpose, and context. Separate what the text promised in 1215 from meanings later generations attached to it.`,
    `DNA replication is semiconservative: each daughter DNA molecule contains one parental strand and one newly synthesized strand. Helicase unwinds the helix; single-strand binding proteins stabilize templates; topoisomerase reduces torsional strain. Primase lays RNA primers because DNA polymerase cannot start synthesis from nothing.\n\nDNA polymerase adds nucleotides to a free 3′ OH, so new DNA is synthesized 5′ to 3′. The leading strand is continuous toward the replication fork. The lagging strand forms Okazaki fragments away from the fork. RNA primers are replaced with DNA and ligase seals remaining nicks. Proofreading and mismatch repair improve fidelity.\n\nEXAM CHECK: explain why antiparallel strands require continuous and discontinuous synthesis; label primer, polymerase direction, and ligase on a replication fork.`,
];
function library() {
    let group = state.noteFolder || "BIO 204",
        selected = state.selectedNote,
        indices = notes
            .map((_, i) => i)
            .filter((i) => group === "all" || notes[i][0] === group);
    return `<div class="page-content"><div class="subject-tabs">${[
        ["BIO 204", "Biology"],
        ["HIST 110", "History"],
        ["all", "All notes"],
    ]
        .map(
            ([id, label]) =>
                `<button class="${group === id ? "active" : ""}" onclick="state.noteFolder='${id}';state.selectedNote=null;renderApp()">${label} · ${id === "all" ? notes.length : notes.filter((n) => n[0] === id).length}</button>`,
        )
        .join(
            "",
        )}</div><div class="note-actions"><button class="btn small" onclick="newNote()">＋ New note</button><button class="btn light small" onclick="manageSubjects()">Manage subjects</button><button class="btn light small" onclick="createQuiz()">✦ Build review quiz from selected notes</button></div><div class="notes-grid" id="notes-grid">${indices.map((i) => `<article class="note-card" data-note="${i}" onclick="selectNote(${i})"><input type="checkbox" class="note-select" aria-label="Select ${esc(notes[i][1])}" onclick="event.stopPropagation()"><span class="tag">${notes[i][0] === "BIO 204" ? "BIOLOGY 204" : "HISTORY 110"}</span><h3>${esc(notes[i][1])}</h3><p>${esc(notes[i][2])}</p><button class="linkbutton" onclick="event.stopPropagation();selectNote(${i})">Open full note →</button></article>`).join("")}</div>${selected !== null && selected !== undefined ? noteDetail(selected) : ""}</div>`;
}
function selectNote(i) {
    state.selectedNote = i;
    renderApp();
    document
        .querySelector(".note-detail")
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function noteDetail(i) {
    let n = notes[i];
    return `<section class="note-detail"><div class="detail-top"><span class="tag">${n[0] === "BIO 204" ? "BIOLOGY 204" : "HISTORY 110"}</span><button class="iconbtn" onclick="state.selectedNote=null;renderApp()">Close ×</button></div><h2>${esc(n[1])}</h2><div class="subtitle">Complete study notes · Review guide</div><div class="note-body">${esc(fullNotes[i] || n[2])}</div><button class="btn small" onclick="createQuiz([${i}])">Create quiz from this note</button></section>`;
}
function schedule() {
    if (state.user?.plan !== "Duo")
        return locked(
            "Course planner",
            "Plan classes, exams, and study blocks in one flexible calendar. Upgrade to Duo to unlock the course planner.",
        );
    let first = new Date(state.year, state.month, 1),
        start = (first.getDay() + 6) % 7,
        days = new Date(state.year, state.month + 1, 0).getDate(),
        cells = Array.from({ length: 42 }, (_, i) => {
            let d = i - start + 1;
            return `<div class="cal-cell">${d > 0 && d <= days ? d : ""}${d === 3 ? '<span class="cal-event">9:00 Biology lecture</span>' : ""}${d === 5 ? '<span class="cal-event exam">Biology midterm · 2 PM</span>' : ""}${d === 9 ? '<span class="cal-event">History seminar</span>' : ""}${d === 13 ? '<span class="cal-event exam">Chem lab report</span>' : ""}${d === 18 ? '<span class="cal-event">Study group</span>' : ""}</div>`;
        }).join("");
    return `<div class="calendar-layout"><div class="card"><div class="calendar-toolbar"><button class="iconbtn" onclick="changeMonth(-1)">←</button><h3 style="margin:0">${new Date(state.year, state.month).toLocaleString("en", { month: "long", year: "numeric" })}</h3><button class="iconbtn" onclick="changeMonth(1)">→</button></div><div class="calendar-grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<div class="cal-cell head">${d}</div>`).join("")}${cells}</div></div><aside class="card event-list"><div class="eyebrow">DON'T MISS</div><h3 style="margin-top:8px">Important events</h3>${[
        ["OCT 08", "Biology lecture", "Cell membranes · Science Hall 204"],
        ["OCT 10", "Biology midterm", "Units 1–4 · 2:00 PM"],
        ["OCT 15", "Chemistry lab report", "Lab write-up due · 11:59 PM"],
        ["OCT 18", "History seminar", "Primary-source discussion"],
        ["OCT 23", "Study group", "Library, room 3 · bring your notes"],
    ]
        .map(
            (e) =>
                `<div class="event-row"><span class="event-date">${e[0]}</span><div><b>${e[1]}</b><small>${e[2]}</small></div></div>`,
        )
        .join(
            "",
        )}<button class="btn light small" style="margin-top:14px" onclick="addTask()">＋ Add an event</button></aside></div>`;
}
function libraryFlashcards() {
    return `<div class="flip-stage"><div class="flashcard ${flashFlipped ? "flipped" : ""}" onclick="flipFlashcard()"><div class="flash-face front"><div class="eyebrow">CARD ${state.flashIndex + 1} OF ${flashcards.length} · CLICK TO FLIP</div><h2>${esc(flashcards[state.flashIndex].q)}</h2><p>Think of your answer, then tap the card</p></div><div class="flash-face back"><div class="eyebrow">ANSWER</div><h2>${esc(flashcards[state.flashIndex].a)}</h2><p>Tap to return to the question</p></div></div></div><div style="display:flex;justify-content:center;gap:9px;flex-wrap:wrap"><button class="btn light small" onclick="changeFlash(-1)">← Previous</button><button class="btn small" onclick="changeFlash(1)">Next card →</button><button class="btn light small" onclick="createQuiz()">Build review quiz</button></div>`;
}

function library() {
    if (state.libraryTab === "flashcards" && state.user?.plan === "Duo")
        return `<div class="page-content"><div class="tabs"><button onclick="state.libraryTab='notes';renderApp()">Notes</button><button class="active">Flashcards</button></div>${libraryFlashcards()}</div>`;
    if (state.libraryTab === "flashcards" && state.user?.plan !== "Duo")
        return `<div class="page-content"><div class="tabs"><button onclick="state.libraryTab='notes';renderApp()">Notes</button><button class="active">Flashcards</button></div>${locked("Flashcards", "Turn course notes into a quick review deck. Upgrade to Duo to unlock flashcards.")}</div>`;
    let base = libraryOriginal();
    return base;
}
const libraryOriginal = library;

function notesLibrary() {
    let group = state.noteFolder || "BIO 204",
        selected = state.selectedNote,
        indices = notes
            .map((_, i) => i)
            .filter((i) => group === "all" || notes[i][0] === group);
    return `<div class="page-content"><div class="subject-tabs">${[
        ["BIO 204", "Biology"],
        ["HIST 110", "History"],
        ["all", "All notes"],
    ]
        .map(
            ([id, label]) =>
                `<button class="${group === id ? "active" : ""}" onclick="state.noteFolder='${id}';state.selectedNote=null;renderApp()">${label} · ${id === "all" ? notes.length : notes.filter((n) => n[0] === id).length}</button>`,
        )
        .join(
            "",
        )}</div><div class="note-actions"><button class="btn small" onclick="newNote()">＋ New note</button><button class="btn light small" onclick="manageSubjects()">Manage subjects</button><button class="btn light small" onclick="createQuiz()">✦ Build review quiz from selected notes</button></div><div class="notes-grid" id="notes-grid">${indices.map((i) => `<article class="note-card" data-note="${i}" onclick="selectNote(${i})"><input type="checkbox" class="note-select" onclick="event.stopPropagation()"><span class="tag">${notes[i][0]}</span><h3>${esc(notes[i][1])}</h3><p>${esc(notes[i][2])}</p><button class="linkbutton" onclick="event.stopPropagation();selectNote(${i})">Open full note →</button></article>`).join("")}</div>${selected !== null && selected !== undefined ? noteDetail(selected) : ""}</div>`;
}

function library() {
    if (state.libraryTab === "flashcards")
        return `<div class="page-content"><div class="tabs"><button class="${state.libraryTab === "notes" ? "active" : ""}" onclick="state.libraryTab='notes';renderApp()">Notes</button><button class="active">Flashcards</button></div>${state.user?.plan === "Duo" ? libraryFlashcards() : locked("Flashcards", "Turn course notes into a quick review deck. Upgrade to Duo to unlock flashcards.")}</div>`;
    return notesLibrary();
}
function flipFlashcard() {
    flashFlipped = !flashFlipped;
    document
        .querySelector(".flashcard")
        ?.classList.toggle("flipped", flashFlipped);
    trackInteraction();
}
function changeFlash(d) {
    state.flashIndex =
        (state.flashIndex + d + flashcards.length) % flashcards.length;
    flashFlipped = false;
    renderApp();
}
const quizBank = [
    {
        q: "Which membrane component forms the hydrophobic interior of a phospholipid bilayer?",
        opts: [
            "Phosphate heads",
            "Fatty-acid tails",
            "Carbohydrate tags",
            "Peripheral proteins",
        ],
        ans: 1,
        why: "Nonpolar fatty-acid tails point inward, away from water, creating the membrane’s hydrophobic core.",
    },
    {
        q: "A cell is placed in a hypertonic solution. What is the expected net movement of water?",
        opts: [
            "Into the cell by osmosis",
            "Out of the cell by osmosis",
            "No net movement",
            "Water is actively pumped inward",
        ],
        ans: 1,
        why: "The outside solution has higher solute concentration, so water leaves the cell by osmosis.",
    },
    {
        q: "What best distinguishes facilitated diffusion from active transport?",
        opts: [
            "Facilitated diffusion uses proteins; active transport never does",
            "Facilitated diffusion moves down a gradient without direct ATP; active transport can move against a gradient using energy",
            "Only active transport moves ions",
            "Only facilitated diffusion is selective",
        ],
        ans: 1,
        why: "Both may use proteins. Direction relative to the gradient and energy requirement distinguish them.",
    },
    {
        q: "During which mitotic phase do sister chromatids separate?",
        opts: ["Prophase", "Metaphase", "Anaphase", "Telophase"],
        ans: 2,
        why: "At anaphase, sister chromatids separate and move toward opposite poles.",
    },
    {
        q: "Why is the lagging strand synthesized as Okazaki fragments?",
        opts: [
            "Polymerase works only 5′ to 3′ on antiparallel templates",
            "The lagging template contains uracil",
            "Ligase blocks continuous synthesis",
            "The fork moves backward",
        ],
        ans: 0,
        why: "Antiparallel templates plus 5′ to 3′ synthesis require one strand to form short segments.",
    },
    {
        q: "In the ideal competitive inhibition model, what happens at very high substrate concentration?",
        opts: [
            "The inhibitor permanently destroys enzyme",
            "Substrate can outcompete inhibitor, so Vmax can still be reached",
            "Km becomes zero",
            "The reaction reverses direction",
        ],
        ans: 1,
        why: "Competitive inhibitor and substrate compete for the active site; sufficient substrate can restore Vmax.",
    },
    {
        q: "Which statement best describes the Silk Roads?",
        opts: [
            "One paved road controlled by Rome",
            "A network of land and maritime routes with many intermediaries",
            "A route used only for silk",
            "A single empire’s border",
        ],
        ans: 1,
        why: "They were overlapping networks whose routes shifted with geography, politics, and technology.",
    },
    {
        q: "How should Magna Carta be used as historical evidence?",
        opts: [
            "Proof modern democracy began fully formed in 1215",
            "A source shaped by baronial conflict whose later interpretations also matter",
            "Proof all medieval people had equal rights",
            "A neutral account written by King John",
        ],
        ans: 1,
        why: "Its immediate context was an elite political struggle; later generations attached broader constitutional meanings.",
    },
    {
        q: "What does semiconservative DNA replication mean?",
        opts: [
            "Each daughter has two new strands",
            "Each daughter has one parental and one new strand",
            "Only half the genome is copied",
            "DNA copies in one direction only",
        ],
        ans: 1,
        why: "Each daughter double helix conserves one original strand paired with a newly synthesized strand.",
    },
    {
        q: "Enzymes speed reactions primarily by…",
        opts: [
            "Changing equilibrium",
            "Lowering activation energy",
            "Increasing total free energy released",
            "Being consumed",
        ],
        ans: 1,
        why: "Catalysts lower the activation-energy barrier without changing ΔG or equilibrium.",
    },
];
let quizState = { index: 0, score: 0, answered: false };
function createQuiz(indices) {
    if (state.user?.plan !== "Duo") {
        upgrade();
        return;
    }
    let chosen =
        indices ||
        [...document.querySelectorAll(".note-select:checked")]
            .map((el) => Number(el.closest(".note-card")?.dataset.note))
            .filter(Number.isFinite);
    if (
        !chosen.length &&
        state.selectedNote !== null &&
        state.selectedNote !== undefined
    )
        chosen = [state.selectedNote];
    if (!chosen.length) {
        showToast("Select a note, or open one, to begin a review quiz.");
        return;
    }
    quizState = { index: 0, score: 0, answered: false };
    renderQuiz();
}
function renderQuiz() {
    let q = quizBank[quizState.index],
        done = quizState.index >= quizBank.length;
    showModal(
        `<div class="quiz-modal">${done ? `<div class="eyebrow">REVIEW COMPLETE</div><h2>Your review: ${quizState.score} / ${quizBank.length}</h2><p>Use the explanations to revisit concepts, then try the set again when you’re ready.</p><button class="btn" onclick="closeModal();trackInteraction()">Finish review</button> <button class="btn light" onclick="quizState={index:0,score:0,answered:false};renderQuiz()">Try again</button>` : `<div class="eyebrow">IDEALIB REVIEW · ${quizState.index + 1} OF ${quizBank.length}</div><div class="quiz-progress"><span style="width:${Math.round((quizState.index / quizBank.length) * 100)}%"></span></div><h2>Check your understanding</h2><p style="font-size:16px;color:#514650">${q.q}</p><div>${q.opts.map((o, i) => `<button class="btn light quiz-option ${quizState.answered && i === q.ans ? "correct" : ""} ${quizState.answered && i === quizState.choice && i !== q.ans ? "incorrect" : ""}" ${quizState.answered ? "disabled" : ""} onclick="answerQuiz(${i})">${String.fromCharCode(65 + i)}. ${o}</button>`).join("")}</div>${quizState.answered ? `<div class="quiz-explain"><b>${quizState.choice === q.ans ? "Correct" : "Review this one"}</b><br>${q.why}</div><button class="btn" style="margin-top:15px" onclick="nextQuiz()">${quizState.index === quizBank.length - 1 ? "See results" : "Next question →"}</button>` : ""}<p style="font-size:11px">10-question review · Score ${quizState.score}/${quizState.index + (quizState.answered ? 1 : 0)}</p>`}</div>`,
    );
}
function answerQuiz(i) {
    if (quizState.answered) return;
    quizState.answered = true;
    quizState.choice = i;
    if (i === quizBank[quizState.index].ans) quizState.score++;
    renderQuiz();
}
function nextQuiz() {
    quizState.index++;
    quizState.answered = false;
    renderQuiz();
}
function summarizePdf() {
    showModal(
        `<h2>Build a cram-ready study guide</h2><p>Choose a built-in course reading and format. The prototype generates sample review content and does not extract text from uploaded files.</p><div class="field"><label>Source</label><select id="summary-source" style="padding:12px;border:1px solid var(--line);border-radius:10px"><option value="bio">Biology · Membranes and transport</option><option value="rep">Biology · DNA replication</option><option value="hist">History · Silk Roads and exchange</option></select></div><div class="field"><label>Format</label><select id="summary-style" style="padding:12px;border:1px solid var(--line);border-radius:10px"><option value="cram">Cram sheet · high-yield concepts and memory checks</option><option value="deep">Detailed review · mechanisms and exam prompts</option></select></div><button class="btn" onclick="makeSummary()">Generate study guide</button>`,
    );
}
function makeSummary() {
    let source = document.querySelector("#summary-source").value,
        style = document.querySelector("#summary-style").value,
        bank = {
            bio: [
                "Cell Membranes & Transport",
                "The plasma membrane is a selectively permeable phospholipid bilayer. Hydrophilic heads face water; hydrophobic tails create an interior barrier. Passive transport moves down gradients without direct ATP; facilitated diffusion uses channels/carriers. Active transport uses energy to move substances against gradients. The sodium-potassium pump exports 3 Na⁺ and imports 2 K⁺ per ATP.",
                "Exam traps: protein-mediated does not automatically mean active transport. Facilitated diffusion is passive. Osmosis tracks water movement; a hypertonic environment causes net water loss from an animal cell.",
                "Predict water movement from relative solute concentrations. Compare simple diffusion, facilitated diffusion, and active transport. Explain how the Na⁺/K⁺ pump maintains gradients.",
            ],
            rep: [
                "DNA Replication",
                "Replication is semiconservative: each daughter helix has one parental and one new strand. Helicase unwinds; primase makes RNA primers; DNA polymerase extends from a 3′ OH and synthesizes 5′ to 3′; ligase seals nicks.",
                "The leading strand is continuous toward the fork. The lagging strand forms Okazaki fragments because templates are antiparallel and polymerase direction is fixed. Proofreading and mismatch repair improve fidelity.",
                "Why is one strand discontinuous? What does semiconservative mean? Which enzyme seals Okazaki fragments?",
            ],
            hist: [
                "Silk Roads: Networks of Exchange",
                "The Silk Roads were shifting land and maritime networks linking communities across Asia, the Middle East, and the Mediterranean. High-value goods moved through intermediaries; religions, technologies, artistic forms, people, and disease also traveled.",
                "Avoid describing one road or one-way cultural diffusion. Route use depended on geography, political stability, and technology. Local communities mediated and adapted incoming ideas.",
                "Who controlled a corridor? Which intermediaries shaped exchange? What evidence supports claims about cultural movement?",
            ],
        },
        d = bank[source],
        extra =
            style === "cram"
                ? `<div class="keybox"><b>60-second recap:</b> ${esc(d[1])}</div>`
                : "";
    showModal(
        `<div class="summary-content"><div class="eyebrow">${style === "cram" ? "CRAM SHEET" : "DETAILED REVIEW"} · BUILT-IN COURSE GUIDE</div><h2>${d[0]}</h2><div class="keybox"><b>Core idea:</b> ${d[1]}</div>${extra}<h3>Mechanism and key details</h3><p>${d[1]}</p><h3>Common confusions</h3><p>${d[2]}</p><h3>Active recall prompts</h3><ol>${d[3]
            .split(". ")
            .filter(Boolean)
            .map((x) => `<li>${esc(x.replace(/\.$/, ""))}?</li>`)
            .join(
                "",
            )}</ol><h3>Rapid review routine</h3><p>Close your notes and answer each prompt aloud. Reopen the guide only to correct a missing step, then explain the process again without looking.</p><p style="font-size:10px;color:var(--muted)">Sample study guide generated from IdeaLib’s built-in course content. Review alongside assigned readings.</p></div>`,
    );
    trackInteraction();
}
function switchToFree() {
    if (!state.user) return;
    state.user.plan = "Free";
    localStorage.setItem("idealibUser", JSON.stringify(state.user));
    state.libraryTab = "notes";
    renderApp();
    showToast("Your plan is now Free.");
}
function profile() {
    let u = state.user || {
        name: "Student",
        email: "student@example.com",
        plan: "Free",
    };
    return `<div class="profile-banner"></div><section class="profile-card"><div class="profile-head"><div class="profile-avatar">${esc(u.name.charAt(0).toUpperCase())}</div><div><h2>${esc(u.name)}</h2><div class="subtitle">${esc(u.email)}</div></div><button class="btn light small" style="margin-left:auto" onclick="editProfile()">Edit profile</button></div><div class="profile-fields"><div class="profile-field"><small>FULL NAME</small><b>${esc(u.name)}</b></div><div class="profile-field"><small>EMAIL ADDRESS</small><b>${esc(u.email)}</b></div><div class="profile-field"><small>STUDENT STATUS</small><b>Undergraduate student</b></div><div class="profile-field"><small>STUDY STREAK</small><b>✦ ${state.streak} days and counting</b></div></div></section><section class="card"><div class="card-head"><h3>Subscription</h3><span class="tag">${esc(u.plan || "Free")}</span></div><p class="subtitle" style="margin:0 0 14px">${u.plan === "Duo" ? "Course planner, study tools, quizzes, and flashcards are unlocked." : "Notes, tasks, and basic focus sessions are included."}</p>${u.plan === "Duo" ? `<button class="btn light small" onclick="showToast('Duo is active in this prototype.')">Manage plan</button> <button class="btn small" onclick="switchToFree()">Switch to Free</button>` : `<button class="btn small" onclick="upgrade()">Upgrade to Duo · ₱159/month</button>`} <button class="linkbutton" style="float:right" onclick="logout()">Log out</button></section>`;
}
function noteDetail(i) {
    let n = notes[i];
    return `<div class="note-overlay" onclick="if(event.target===this){state.selectedNote=null;renderApp()}"><section class="note-detail" role="dialog" aria-modal="true" aria-label="${esc(n[1])}"><div class="detail-top"><span class="tag">${n[0] === "BIO 204" ? "BIOLOGY 204" : "HISTORY 110"}</span><button class="iconbtn" onclick="state.selectedNote=null;renderApp()">Close ×</button></div><h2>${esc(n[1])}</h2><div class="subtitle">Complete study notes · Review guide</div><div class="note-body">${esc(fullNotes[i] || n[2])}</div><button class="btn small" onclick="createQuiz([${i}])">Create quiz from this note</button></section></div>`;
}
function selectNote(i) {
    state.selectedNote = i;
    renderApp();
}
function setCustomTimer() {
    let minutes = Number(document.querySelector("#custom-minutes")?.value);
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 180) {
        showToast("Choose a custom session from 1 to 180 minutes.");
        return;
    }
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.customTimer = minutes;
    state.timer = minutes * 60;
    updateTimerDisplay();
    showToast(`Custom focus session set to ${minutes} minutes.`);
}
function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.timer =
        (state.customTimer ||
            Number(document.querySelector("#timer-style")?.value || 25)) * 60;
    updateTimerDisplay();
}
function setTimerStyle(m) {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.customTimer = Number(m);
    state.timer = Number(m) * 60;
    updateTimerDisplay();
}
let uploadedPdfs = [],
    pdfjsPromise = null,
    ocrPromise = null;
function ensurePdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfjsPromise) return pdfjsPromise;
    pdfjsPromise = new Promise((resolve, reject) => {
        let tag = document.createElement("script");
        tag.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        tag.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
            resolve(window.pdfjsLib);
        };
        tag.onerror = () =>
            reject(
                new Error(
                    "PDF text reader could not load. Check your connection and try again.",
                ),
            );
        document.head.appendChild(tag);
    });
    return pdfjsPromise;
}
function uploadPdf() {
    showModal(
        `<h2>Add a shared course PDF</h2><p>Upload a text-based PDF. It will appear in Shared course PDFs and become selectable in the study guide builder.</p><div class="field"><label for="pdf-upload">PDF file</label><input id="pdf-upload" type="file" accept="application/pdf,.pdf"></div><button class="btn" onclick="readPdfUpload()">Add to shared PDFs</button><p style="font-size:10px">PDF text is processed in your browser. Scanned image-only PDFs may not contain extractable text.</p>`,
    );
}
async function readPdfUpload() {
    let file = document.querySelector("#pdf-upload")?.files?.[0];
    if (!file) {
        showToast("Choose a PDF file first.");
        return;
    }
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
        showToast("Please choose a PDF file.");
        return;
    }
    let doc = {
        id: "pdf-" + Date.now(),
        name: file.name,
        file,
        text: "",
        pages: 0,
        status: "Reading PDF…",
    };
    uploadedPdfs.unshift(doc);
    closeModal();
    renderApp();
    try {
        let pdfjs = await ensurePdfJs(),
            pdf = await pdfjs.getDocument({
                data: new Uint8Array(await file.arrayBuffer()),
            }).promise;
        doc.pages = pdf.numPages;
        let pageTexts = [];
        for (let n = 1; n <= pdf.numPages; n++) {
            let page = await pdf.getPage(n),
                content = await page.getTextContent();
            pageTexts.push(content.items.map((x) => x.str || "").join(" "));
        }
        doc.text = pageTexts.join("\n\n").replace(/\s+/g, " ").trim();
        doc.status = doc.text.length
            ? "Ready to summarize"
            : "No selectable text found";
    } catch (err) {
        doc.status = "Could not read";
        doc.error = err.message;
    }
    renderApp();
    if (doc.text) showToast(`${doc.name} is ready in the summarizer.`);
    else showToast(doc.error || "No selectable text found in this PDF.");
}
function openPdf(id) {
    let d = uploadedPdfs.find((x) => x.id === id);
    if (!d) return;
    if (d.file) {
        let url = URL.createObjectURL(d.file);
        window.open(url, "_blank", "noopener");
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    } else showToast("Upload a PDF to preview its contents.");
}
function summarizePdf() {
    if (!uploadedPdfs.length) {
        showModal(
            `<h2>Add a PDF to get started</h2><p>Upload a course PDF first. The same file will appear in Shared course PDFs and can then be selected here for an extracted-text review guide.</p><button class="btn" onclick="closeModal();uploadPdf()">＋ Add a PDF</button>`,
        );
        return;
    }
    showModal(
        `<h2>Build a study guide from a PDF</h2><p>Select one of your shared PDFs. IdeaLib extracts selectable PDF text and builds a review sheet from its key sentences and terms in your browser.</p><div class="field"><label>Shared course PDF</label><select id="summary-pdf" style="padding:12px;border:1px solid var(--line);border-radius:10px">${uploadedPdfs.map((d) => `<option value="${d.id}" ${d.text ? "" : "disabled"}>${esc(d.name)} — ${d.text ? `${d.pages} pages` : `${esc(d.status)}`}</option>`).join("")}</select></div><div class="field"><label>Review format</label><select id="summary-style" style="padding:12px;border:1px solid var(--line);border-radius:10px"><option value="cram">Cram sheet · concise key points</option><option value="deep">Detailed review · key points, terms, and recall prompts</option></select></div><button class="btn" onclick="makeSummary()">Generate from this PDF</button>`,
    );
}
const stopWords = new Set(
    "the and for that with this from are was were has have had into about than then them they their there which when where what while also each other some more most such only very over under between through using use used into your you our its can will may not but all any one two three based across after before because been being both these those how why".split(
        " ",
    ),
);
function buildPdfGuide(text, name, style) {
    let clean = text.replace(/\s+/g, " ").trim(),
        sentences = (clean.match(/[^.!?]+[.!?]+/g) || [clean])
            .map((x) => x.trim())
            .filter((x) => x.length > 35),
        freq = {};
    for (let w of clean.toLowerCase().match(/[a-z][a-z-]{3,}/g) || []) {
        if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
    }
    let scored = sentences
        .map((s, i) => ({
            s,
            i,
            score:
                (s.toLowerCase().match(/[a-z][a-z-]{3,}/g) || []).reduce(
                    (a, w) => a + (stopWords.has(w) ? 0 : freq[w] || 0),
                    0,
                ) / Math.sqrt(s.length),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, style === "cram" ? 7 : 12)
        .sort((a, b) => a.i - b.i);
    let terms = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map((x) => x[0]);
    let points = scored.map((x) => `<li>${esc(x.s)}</li>`).join(""),
        termsHtml = terms
            .map(
                (x) =>
                    `<span class="tag" style="display:inline-block;margin:3px">${esc(x)}</span>`,
            )
            .join(""),
        prompts = scored
            .slice(0, Math.min(6, scored.length))
            .map(
                (x, i) =>
                    `<li>Explain the key idea in this point in your own words: “${esc(x.s.slice(0, 150))}${x.s.length > 150 ? "…" : ""}”</li>`,
            )
            .join("");
    return `<div class="summary-content"><div class="eyebrow">${style === "cram" ? "CRAM SHEET" : "DETAILED REVIEW"} · EXTRACTED FROM YOUR PDF</div><h2>${esc(name)}</h2><div class="keybox"><b>Text extracted:</b> ${clean.length.toLocaleString()} characters. Key points are selected from recurring vocabulary and sentence relevance.</div><h3>High-yield points</h3><ol>${points || "<li>Text could not be divided into review points.</li>"}</ol><h3>Key terms from this reading</h3><p>${termsHtml || "No terms found."}</p>${style === "deep" ? `<h3>Active recall prompts</h3><ol>${prompts}</ol><h3>Suggested review</h3><p>Cover the key points and answer each prompt aloud. Reopen the PDF to verify details, examples, and any context that a short guide may omit.</p>` : ""}<p style="font-size:10px;color:var(--muted)">Generated locally from extracted PDF text using keyword and sentence ranking. Check the original PDF for equations, diagrams, tables, and context.</p></div>`;
}
function makeSummary() {
    let id = document.querySelector("#summary-pdf")?.value,
        doc = uploadedPdfs.find((x) => x.id === id),
        style = document.querySelector("#summary-style")?.value || "cram";
    if (!doc?.text) {
        showToast("That PDF has no extracted text yet.");
        return;
    }
    showModal(buildPdfGuide(doc.text, doc.name, style));
    trackInteraction();
}
function tools() {
    if (state.user?.plan !== "Duo")
        return locked(
            "Study tools",
            "Add shared course PDFs, generate review guides, and make flashcards with Duo.",
        );
    return `<div class="tool-grid"><section class="tool-card"><div class="eyebrow">YOUR MATERIALS</div><h3>Shared course PDFs</h3><p>Upload lecture transes and readings. Added files are available in the study guide builder.</p><button class="btn light small" onclick="uploadPdf()">＋ Add PDF</button> <button class="btn light small" onclick="scanPdf()">⌕ Scan PDF</button><div style="margin-top:12px">${uploadedPdfs.length ? uploadedPdfs.map((d) => `<div class="file-row"><span>▧ &nbsp;${esc(d.name)}<small class="pdf-status ${d.text ? "ready" : ""}"><br>${esc(d.status)}${d.pages ? ` · ${d.pages} pages` : ""}</small></span><span><button class="linkbutton" onclick="openPdf('${d.id}')">Open</button><button class="linkbutton" onclick="summarizeSpecificPdf('${d.id}')">Study</button><button class="linkbutton" onclick="deletePdf('${d.id}')">×</button></span></div>`).join("") : '<p class="subtitle">No PDFs yet. Add a file to connect it to your review guides.</p>'}</div></section><section class="tool-card"><div class="eyebrow">PDF STUDY ASSISTANT</div><h3>PDF summarizer</h3><p>Extract key points and terms from a shared PDF, then make a cram sheet or detailed review.</p><button class="btn small" onclick="summarizePdf()">✦ Build a PDF study guide</button><p class="pdf-status" style="margin-top:12px">Works with text-based PDFs. Processing happens in this browser.</p></section><section class="tool-card"><div class="eyebrow">ACTIVE RECALL</div><h3>Quiz & flashcards</h3><p>Practice what you know or review a biology deck.</p><button class="btn small" onclick="createQuiz()">Generate a quick quiz</button> <button class="btn light small" onclick="go('library');state.libraryTab='flashcards';renderApp()">View flashcards</button></section><section class="tool-card"><div class="eyebrow">FOCUS TIMER</div><h3>Make a little space</h3><div class="field"><label>Quick session</label><select id="timer-style" onchange="setTimerStyle(this.value)" style="padding:10px;border:1px solid var(--line);border-radius:10px"><option value="25">Pomodoro · 25 min</option><option value="50">Deep focus · 50 min</option><option value="15">Short sprint · 15 min</option></select></div><div class="custom-timer"><div class="field"><label for="custom-hours">Hours</label><input id="custom-hours" type="number" min="0" max="12" value="0"></div><div class="field"><label for="custom-minutes">Minutes</label><input id="custom-minutes" type="number" min="0" max="59" value="25"></div><div class="field"><label for="custom-seconds">Seconds</label><input id="custom-seconds" type="number" min="0" max="59" value="0"></div><button class="btn light small" onclick="setCustomTimer()">Set</button></div><div class="timer-num" id="timer-num">${formatTime(state.timer)}</div><div class="timer-controls"><button onclick="toggleTimer()" id="timer-button">${state.timerRunning ? "Pause" : "Start"}</button><button onclick="resetTimer()">Reset</button></div></section></div>`;
}
function summarizeSpecificPdf(id) {
    if (!uploadedPdfs.find((d) => d.id === id)?.text) {
        showToast("PDF text is still being processed.");
        return;
    }
    summarizePdf();
    setTimeout(() => {
        let select = document.querySelector("#summary-pdf");
        if (select) {
            select.value = id;
            makeSummary();
        }
    }, 0);
}
function deletePdf(id) {
    uploadedPdfs = uploadedPdfs.filter((d) => d.id !== id);
    renderApp();
    showToast("PDF removed from shared materials.");
}
function formatTime(s) {
    s = Math.max(0, Math.floor(s));
    let h = Math.floor(s / 3600),
        m = Math.floor((s % 3600) / 60),
        sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
function setCustomTimer() {
    let h = Number(document.querySelector("#custom-hours")?.value || 0),
        m = Number(document.querySelector("#custom-minutes")?.value || 0),
        s = Number(document.querySelector("#custom-seconds")?.value || 0);
    if (
        !Number.isInteger(h) ||
        !Number.isInteger(m) ||
        !Number.isInteger(s) ||
        h < 0 ||
        h > 12 ||
        m < 0 ||
        m > 59 ||
        s < 0 ||
        s > 59 ||
        h * 3600 + m * 60 + s < 1
    ) {
        showToast("Set a duration from 1 second to 12 hours.");
        return;
    }
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.customTimer = h * 3600 + m * 60 + s;
    state.timer = state.customTimer;
    updateTimerDisplay();
    showToast("Custom focus time set.");
}
function setTimerStyle(m) {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.customTimer = Number(m) * 60;
    state.timer = state.customTimer;
    let input = document.querySelector("#custom-minutes");
    if (input) input.value = Number(m);
    let hi = document.querySelector("#custom-hours");
    if (hi) hi.value = 0;
    let sec = document.querySelector("#custom-seconds");
    if (sec) sec.value = 0;
    updateTimerDisplay();
}
function resetTimer() {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    state.timer =
        state.customTimer ||
        Number(document.querySelector("#timer-style")?.value || 25) * 60;
    updateTimerDisplay();
}
function overview() {
    let order = state.tasks
        .map((task, i) => ({ task, i, done: state.completed.includes(i) }))
        .sort((a, b) => Number(a.done) - Number(b.done));
    let open = order.filter((x) => !x.done).length;
    let courses = ["Biology 204", "HIST 110", "Chemistry Lab"];
    return `<div class="action-row"><button class="btn" onclick="newNote()">＋ New note</button><button class="btn light" onclick="go('tools');scanPdf()">⇧ Scan PDF</button><button class="btn light" onclick="addTask()">＋ Add assignment</button><button class="btn light" onclick="go('library')">Open library</button></div><div class="stats"><div class="stat"><span>TASKS THIS WEEK</span><b>${state.completed.length}/${state.tasks.length}</b></div><div class="stat"><span>UPCOMING</span><b>${open}</b></div><div class="stat"><span>STUDY STREAK</span><b>${state.streak} <small style="font-size:12px">days</small></b></div></div><div class="dashboard-grid"><section class="card"><div class="card-head"><h3>Progress overview</h3><span class="eyebrow">Based on task completion</span></div>${courses
        .map((course) => {
            let relevant = state.tasks
                    .map((t, i) => ({ t, i }))
                    .filter(
                        (x) =>
                            x.t.course.toLowerCase().includes(course.toLowerCase()) ||
                            course.toLowerCase().includes(x.t.course.toLowerCase()),
                    ),
                done = relevant.filter((x) => state.completed.includes(x.i)).length,
                pct = relevant.length ? Math.round((done / relevant.length) * 100) : 0;
            return `<div class="progress-row"><div class="progress-label"><b>${esc(course)}</b><span>${relevant.length ? `${pct}% · ${done}/${relevant.length} tasks` : "No linked tasks"}</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div>`;
        })
        .join(
            "",
        )}<button class="linkbutton" onclick="go('schedule')">Open course planner →</button></section><section class="card"><div class="card-head"><h3>Upcoming deadlines</h3><button class="linkbutton" onclick="go('tasks')">See all</button></div>${order.length ? order.map(({ task: t, i, done }) => `<div class="week-item ${done ? "done" : ""}" onclick="toggleTask(${i})"><input type="checkbox" ${done ? "checked" : ""} aria-label="Mark ${esc(t.title)} ${done ? "incomplete" : "complete"}" onclick="event.stopPropagation()" onchange="toggleTask(${i})"><span><b class="deadline-title">${esc(t.title)}</b><small>${esc(t.course)}</small></span><span class="due ${t.due === "Today" ? "soon" : ""}">${esc(done ? "Done" : t.due)}</span><button class="deadline-delete" title="Delete deadline" aria-label="Delete ${esc(t.title)}" onclick="event.stopPropagation();removeTask(${i})">Delete</button></div>`).join("") : '<p class="subtitle">All caught up. Enjoy the breathing room ✨</p>'}</section></div><div class="bottom-grid"><section class="card timer-card"><div><span class="eyebrow" style="color:#e4cee5">FOCUS SESSION · POMODORO</span><h3>Ready for a deep dive?</h3><div class="timer-num" id="timer-num">${formatTime(state.timer)}</div></div><div class="timer-controls"><button onclick="toggleTimer()" id="timer-button">${state.timerRunning ? "Pause" : "Start focus"}</button><button onclick="resetTimer()">Reset</button><button onclick="go('tools')">Timer settings</button></div></section><section class="card"><div class="card-head"><h3>This week</h3><span class="eyebrow">Your momentum</span></div><ul class="activity-list"><li><span class="dot"></span>Biology notes updated <span style="margin-left:auto;color:var(--muted)">Today</span></li><li><span class="dot" style="background:#d3a878"></span>${open} tasks remain <span style="margin-left:auto;color:var(--muted)">This week</span></li><li><span class="dot" style="background:#91a48c"></span>Focus timer ready <span style="margin-left:auto;color:var(--muted)">Now</span></li></ul></section></div>`;
}
let calendarEvents = JSON.parse(
        localStorage.getItem("idealibCalendarEvents") || "[]",
    ),
    activeGuideHtml = "",
    activeGuideName = "IdeaLib reviewer";
function persistCalendar() {
    localStorage.setItem("idealibCalendarEvents", JSON.stringify(calendarEvents));
}
function dayKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function schedule() {
    if (state.user?.plan !== "Duo")
        return locked(
            "Course planner",
            "Plan classes, exams, and study blocks in one flexible calendar. Upgrade to Duo to unlock the course planner.",
        );
    let first = new Date(state.year, state.month, 1),
        offset = (first.getDay() + 6) % 7,
        days = new Date(state.year, state.month + 1, 0).getDate(),
        chosen =
            state.selectedCalendarDate ||
            dayKey(
                new Date(state.year, state.month, Math.min(new Date().getDate(), days)),
            ),
        cells = Array.from({ length: 42 }, (_, i) => {
            let day = i - offset + 1;
            if (day < 1 || day > days) return '<div class="cal-cell"></div>';
            let key = dayKey(new Date(state.year, state.month, day)),
                evs = calendarEvents.filter((e) => e.date === key),
                tasks = state.tasks.filter((t) => t.calendarDate === key);
            return `<div class="cal-cell day-cell ${chosen === key ? "selected" : ""}" onclick="selectCalendarDay('${key}')"><b>${day}</b>${evs
                .slice(0, 2)
                .map(
                    (e) =>
                        `<span class="event-chip" title="${esc(e.subject)} · ${esc(e.title)}">${esc(e.time)} ${esc(e.title)}</span>`,
                )
                .join("")}${tasks
                .slice(0, 1)
                .map(
                    (t) =>
                        `<span class="event-chip task-chip" title="Task deadline">${esc(t.title)}</span>`,
                )
                .join(
                    "",
                )}${evs.length + tasks.length > 3 ? `<small>+${evs.length + tasks.length - 2} more</small>` : ""}</div>`;
        }).join(""),
        courses = ["Biology 204", "HIST 110", "Chemistry Lab"],
        tasks = state.tasks.map((t, i) => ({ t, i }));
    let agenda = calendarEvents
        .filter((e) => e.date >= dayKey(new Date()))
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    return `<div class="calendar-toolbar"><button class="iconbtn" onclick="changeMonth(-1)">←</button><h3 style="margin:0">${new Date(state.year, state.month).toLocaleString("en", { month: "long", year: "numeric" })}</h3><div><button class="iconbtn" onclick="changeMonth(1)">→</button> <button class="btn small" onclick="addCalendarEvent('${chosen}')">＋ Add event</button></div></div><div class="calendar-layout"><div class="card"><div class="calendar-grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<div class="cal-cell head">${d}</div>`).join("")}${cells}</div><p class="subtitle" style="margin-top:12px">Select a date to view or add events. Selected: <b>${new Date(chosen + "T12:00:00").toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</b></p><button class="btn light small" onclick="addCalendarEvent('${chosen}')">＋ Add event on selected date</button></div><aside class="card event-list"><div class="eyebrow">UPCOMING</div><h3 style="margin-top:8px">Important events</h3>${
        agenda.length
            ? agenda
                .slice(0, 8)
                .map(
                    (e) =>
                        `<div class="event-row"><span class="event-date">${new Date(e.date + "T12:00:00").toLocaleDateString("en", { month: "short", day: "numeric" }).toUpperCase()}</span><div><b>${esc(e.title)}</b><small>${esc(e.subject)} · ${esc(e.time)}</small><button class="linkbutton" onclick="deleteCalendarEvent('${e.id}')">Remove</button></div></div>`,
                )
                .join("")
            : '<p class="subtitle">No events yet. Add one from the calendar.</p>'
    }</aside></div><section class="card" style="margin-top:17px"><div class="card-head"><h3>Course progress</h3><span class="eyebrow">Updates from your task tracker</span></div><div class="course-progress-grid">${courses
        .map((course) => {
            let linked = tasks.filter(
                    (x) =>
                        x.t.course.toLowerCase().includes(course.toLowerCase()) ||
                        course.toLowerCase().includes(x.t.course.toLowerCase()),
                ),
                done = linked.filter((x) => state.completed.includes(x.i)).length,
                pct = linked.length ? Math.round((done / linked.length) * 100) : 0;
            return `<div class="course-progress-card"><b>${esc(course)}</b><small>${linked.length ? `${done} of ${linked.length} linked tasks complete` : "No linked assignments yet"}</small><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><button class="linkbutton" onclick="go('tasks')">View tasks →</button></div>`;
        })
        .join(
            "",
        )}</div></section><section class="card" style="margin-top:17px"><div class="card-head"><h3>Task deadlines</h3><button class="linkbutton" onclick="go('tasks')">Open task tracker →</button></div>${tasks.length ? tasks.map(({ t, i }) => `<div class="event-row"><span class="event-date">${state.completed.includes(i) ? "DONE" : "TASK"}</span><div><b class="${state.completed.includes(i) ? "deadline-title" : ""}">${esc(t.title)}</b><small>${esc(t.course)} · ${esc(t.date)}</small></div></div>`).join("") : '<p class="subtitle">No tasks in your tracker yet.</p>'}</section>`;
}
function selectCalendarDay(key) {
    state.selectedCalendarDate = key;
    renderApp();
}
function addCalendarEvent(key) {
    showModal(
        `<h2>Add calendar event</h2><p>Add a class, exam, or study session to this date.</p><form onsubmit="saveCalendarEvent(event)"><div class="field"><label>Subject</label><input name="subject" required placeholder="Biology 204"></div><div class="field"><label>Event title</label><input name="title" required placeholder="Midterm review"></div><div class="field"><label>Day</label><input name="date" type="date" required value="${esc(key || state.selectedCalendarDate || dayKey(new Date()))}"></div><div class="field"><label>Time</label><input name="time" type="time" required value="09:00"></div><button class="btn">Save event</button></form>`,
    );
}
function saveCalendarEvent(event) {
    event.preventDefault();
    let f = new FormData(event.target),
        item = {
            id: "event-" + Date.now(),
            subject: f.get("subject"),
            title: f.get("title"),
            date: f.get("date"),
            time: f.get("time"),
        };
    calendarEvents.push(item);
    calendarEvents.sort((a, b) =>
        (a.date + a.time).localeCompare(b.date + b.time),
    );
    persistCalendar();
    state.year = Number(item.date.slice(0, 4));
    state.month = Number(item.date.slice(5, 7)) - 1;
    state.selectedCalendarDate = item.date;
    closeModal();
    renderApp();
    showToast("Event added to your course planner.");
}
function deleteCalendarEvent(id) {
    calendarEvents = calendarEvents.filter((e) => e.id !== id);
    persistCalendar();
    renderApp();
    showToast("Calendar event removed.");
}
function changeMonth(d) {
    state.month += d;
    if (state.month < 0) {
        state.month = 11;
        state.year--;
    }
    if (state.month > 11) {
        state.month = 0;
        state.year++;
    }
    renderApp();
}
function uploadPdf(scan = false) {
    showModal(
        `<h2>${scan ? "Scan a course PDF" : "Add a shared course PDF"}</h2><p>Upload a text-based PDF or enable OCR for a scanned/image-only PDF. Files are processed locally in your browser.</p><div class="field"><label for="pdf-upload">PDF file</label><input id="pdf-upload" type="file" accept="application/pdf,.pdf"></div><label style="display:flex;gap:9px;align-items:center;font-size:12px;margin:8px 0 16px"><input id="pdf-ocr" type="checkbox" ${scan ? "checked" : ""}> Try OCR if the PDF has no selectable text</label><button class="btn" onclick="readPdfUpload()">Add to shared PDFs</button><p style="font-size:10px">OCR needs an internet connection to load its language model. Very large scans may take a while.</p>`,
    );
}
function ensureTesseract() {
    if (window.Tesseract) return Promise.resolve(window.Tesseract);
    if (ocrPromise) return ocrPromise;
    ocrPromise = new Promise((resolve, reject) => {
        let t = document.createElement("script");
        t.src =
            "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
        t.onload = () => resolve(window.Tesseract);
        t.onerror = () =>
            reject(new Error("OCR could not load. Check your connection."));
        document.head.appendChild(t);
    });
    return ocrPromise;
}
async function readPdfUpload() {
    let file = document.querySelector("#pdf-upload")?.files?.[0],
        useOcr = !!document.querySelector("#pdf-ocr")?.checked;
    if (!file) {
        showToast("Choose a PDF file first.");
        return;
    }
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
        showToast("Please choose a PDF file.");
        return;
    }
    let doc = {
        id: "pdf-" + Date.now(),
        name: file.name,
        file,
        text: "",
        pages: 0,
        status: "Reading PDF…",
    };
    uploadedPdfs.unshift(doc);
    closeModal();
    renderApp();
    try {
        let lib = await ensurePdfJs(),
            pdf = await lib.getDocument({
                data: new Uint8Array(await file.arrayBuffer()),
            }).promise;
        doc.pages = pdf.numPages;
        let chunks = [];
        for (let n = 1; n <= pdf.numPages; n++) {
            let page = await pdf.getPage(n),
                content = await page.getTextContent();
            chunks.push(
                content.items
                    .map((x) => (x.str || "") + (x.hasEOL ? "\n" : " "))
                    .join(""),
            );
        }
        doc.text = chunks
            .join("\n\n")
            .replace(/[ \t]+/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();
        if (doc.text.length < 120 && useOcr) {
            doc.status = "Running OCR…";
            renderApp();
            let T = await ensureTesseract(),
                worker = await T.createWorker("eng");
            let results = [];
            for (let n = 1; n <= Math.min(pdf.numPages, 20); n++) {
                let page = await pdf.getPage(n),
                    viewport = page.getViewport({ scale: 1.35 }),
                    canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: canvas.getContext("2d"), viewport })
                    .promise;
                let result = await worker.recognize(canvas);
                results.push(result.data.text);
                canvas.width = canvas.height = 0;
            }
            await worker.terminate();
            doc.text = results.join("\n\n").trim();
            doc.status = doc.text ? "OCR ready" : "No readable text found";
        } else
            doc.status = doc.text ? "Ready to summarize" : "No selectable text found";
    } catch (err) {
        doc.status = "Could not read";
        doc.error = err.message;
    }
    renderApp();
    showToast(
        doc.text
            ? `${doc.name} is ready in the study guide builder.`
            : doc.error || doc.status,
    );
}
function buildPdfGuide(text, name, style) {
    let clean = text
            .replace(/\r/g, "")
            .replace(/[ \t]+/g, " ")
            .trim(),
        lines = clean
            .split("\n")
            .map((x) => x.trim())
            .filter(Boolean),
        headings = lines
            .filter(
                (x) =>
                    x.length > 3 &&
                    x.length < 90 &&
                    (/^[A-Z0-9\s:–—-]{4,}$/.test(x) ||
                        /^\d+(\.\d+)*\s+[A-Z]/.test(x) ||
                        (/^[A-Z][\w ,:&()-]{3,75}$/.test(x) && !/[.!?]$/.test(x))),
            )
            .slice(0, 10),
        sentences = (clean.replace(/\n+/g, " ").match(/[^.!?]+[.!?]+/g) || [clean])
            .map((x) => x.trim())
            .filter((x) => x.length > 35),
        freq = {};
    for (let w of clean.toLowerCase().match(/[a-z][a-z-]{3,}/g) || []) {
        if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
    }
    let scored = sentences
            .map((s, i) => ({
                s,
                i,
                score:
                    (s.toLowerCase().match(/[a-z][a-z-]{3,}/g) || []).reduce(
                        (a, w) => a + (stopWords.has(w) ? 0 : freq[w] || 0),
                        0,
                    ) / Math.sqrt(s.length),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, style === "cram" ? 8 : 14)
            .sort((a, b) => a.i - b.i),
        terms = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 12),
        topicHtml = headings
            .map((h) => `<li>${esc(h.replace(/\s+/g, " "))}</li>`)
            .join(""),
        points = scored.map((x) => `<li>${esc(x.s)}</li>`).join(""),
        termHtml = terms
            .map(
                ([w, count]) =>
                    `<div class="doc-term"><b>${esc(w)}</b>Appears ${count} time${count === 1 ? "" : "s"} in the extracted text. Re-read its surrounding passage for the course-specific definition.</div>`,
            )
            .join(""),
        prompts = scored
            .slice(0, 6)
            .map(
                (x) =>
                    `<li>Explain this idea from memory, then check the source: ${esc(x.s.slice(0, 190))}${x.s.length > 190 ? "…" : ""}</li>`,
            )
            .join("");
    return `<article class="study-document"><div class="doc-kicker">IDEALIB · COURSE REVIEWER</div><h1>${esc(name.replace(/\.pdf$/i, ""))}</h1><div class="doc-meta">Generated ${new Date().toLocaleDateString()} · ${clean.length.toLocaleString()} extracted characters · ${style === "cram" ? "Cram sheet" : "Detailed review"}</div><div class="doc-callout"><b>How to use this reviewer</b><br>Start with the key takeaways. Cover the page and recall each point in your own words, then return to the original PDF for equations, diagrams, examples, and details.</div>${headings.length ? `<h2>Reading outline</h2><ol>${topicHtml}</ol>` : ""}<h2>Key takeaways</h2><ol>${points || "<li>Not enough readable text to create takeaways.</li>"}</ol><h2>Key terms</h2><div class="doc-terms">${termHtml || "<p>No recurring terms were detected.</p>"}</div>${style === "deep" ? `<h2>Active recall questions</h2><ol>${prompts}</ol><h2>Review plan</h2><p>First explain the topic without looking. Next, revisit missed points in the source. Finish by answering each recall question and checking the evidence in the original pages.</p>` : `<h2>Quick self-check</h2><ul><li>What are the three most important ideas?</li><li>Which term or process needs another pass?</li><li>Can you explain the main argument without looking?</li></ul>`}<div class="doc-footer">IdeaLib · Generated from selectable text${headings.length ? " and document headings" : ""}. Automated extraction can miss context, tables, equations, and scanned content.</div></article>`;
}
function openStudyDocument(markup, name) {
    activeGuideHtml = markup;
    activeGuideName = name;
    modalRoot.innerHTML = `<div class="study-doc-backdrop"><section class="study-doc-shell" role="dialog" aria-modal="true"><header class="study-doc-toolbar"><strong>Study reviewer</strong><button class="btn light small" onclick="downloadStudyGuide()">Download reviewer</button><button class="btn small" onclick="window.print()">Print / Save as PDF</button><button class="iconbtn" onclick="closeModal()">Close ×</button></header><div class="study-doc-scroll">${markup}</div></section></div>`;
}
function downloadStudyGuide() {
    let css = [...document.querySelectorAll("style")]
            .map((x) => x.textContent)
            .join("\n"),
        html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(activeGuideName)}</title><style>body{margin:0;background:#eee;padding:24px}.study-document{width:820px;min-height:1050px;margin:0 auto;background:#fff;padding:70px 78px;color:#302b31;font-family:Georgia,serif}.doc-kicker{font:700 10px Arial;letter-spacing:.19em;color:#806182}.study-document h1{font-size:34px;color:#4d3152}.study-document h2{font-size:21px;color:#68466d;border-bottom:1px solid #eadfea;padding-bottom:8px;margin-top:32px}.study-document h3{font-size:15px;color:#543d56}.study-document p,.study-document li{font-size:14px;line-height:1.8}.study-document li{margin-bottom:10px}.doc-callout{border-left:4px solid #8f6d92;background:#f6eff6;padding:16px 19px;margin:20px 0;line-height:1.75}.doc-terms{display:grid;grid-template-columns:1fr 1fr;gap:9px}.doc-term{border:1px solid #eee4ed;padding:10px}.doc-term b{display:block;color:#664869}.doc-meta,.doc-footer{color:#837983;border-bottom:1px solid #eadfea;padding-bottom:15px}</style><style>
/* Calendar readability, alignment, and soft dashboard spacing */
.calendar-toolbar{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:14px;margin-bottom:20px}
.calendar-toolbar>button:first-child{justify-self:start;width:48px;height:46px;display:grid;place-items:center;border-radius:15px;background:#fffdf9;border:1px solid #eadfea;color:var(--purple);font-size:18px;box-shadow:0 4px 12px #6845680a}
.calendar-toolbar>h3{font-size:27px!important;line-height:1.2;text-align:center;min-width:210px;color:var(--plum)}
.calendar-toolbar>div{justify-self:end;display:flex;align-items:center;gap:9px}
.calendar-toolbar>div .iconbtn{width:46px;height:46px;border-radius:15px;font-size:18px}
.calendar-toolbar>div .btn{border-radius:15px;padding:13px 20px}
.calendar-agenda>h3{font-size:24px;line-height:1.2;margin:8px 0 15px}
.cal-cell.head{text-align:center;font-size:12px;padding:10px 4px;min-height:42px;height:42px;letter-spacing:.03em}
.calendar-grid{grid-template-rows:42px repeat(6,minmax(130px,auto));overflow:hidden;border-radius:13px}
.calendar-grid .cal-cell:first-child{border-top-left-radius:13px}
.calendar-grid .cal-cell:nth-child(7){border-top-right-radius:13px}
.cal-cell.day-cell{padding:10px 9px}
.cal-cell.day-cell>b{display:grid;place-items:center;width:27px;height:27px;text-align:center;font-size:12px;margin:0 auto 7px;border-radius:50%;color:#69576b}
.cal-cell.day-cell.selected>b{background:#744a72;color:white}
.subject-key-row{justify-content:center;padding:12px 16px;gap:10px 17px;margin:10px 0 17px!important;background:#fffaf6;border-radius:16px}
.subject-key-row .subject-key{font-size:11px;color:#746a75}
.subject-key-row .linkbutton{margin-left:0;border-radius:12px;padding:10px 14px}
.calendar-layout{gap:18px}
.calendar-layout>.card,.calendar-agenda{border-radius:22px}
.agenda-tabs button{padding:11px 10px;font-size:12px}
.agenda-event,.agenda-task{border-radius:13px}
@media(max-width:720px){.calendar-grid{grid-template-rows:38px repeat(6,minmax(100px,auto))}.cal-cell.head{height:38px;min-height:38px;font-size:10px}.cal-cell.day-cell{padding:7px 5px}.calendar-toolbar{gap:6px}.calendar-toolbar>h3{font-size:20px!important;min-width:0}.calendar-toolbar>button:first-child,.calendar-toolbar>div .iconbtn{width:40px;height:40px}.calendar-toolbar>div .btn{padding:10px 12px;font-size:11px}}
</style></head><body>${activeGuideHtml}</body></html>`,
        url = URL.createObjectURL(new Blob([html], { type: "text/html" })),
        a = document.createElement("a");
    a.href = url;
    a.download = `${activeGuideName.replace(/[^\w-]+/g, "_")}_reviewer.html`;
    a.click();
    URL.revokeObjectURL(url);
}
function makeSummary() {
    let id = document.querySelector("#summary-pdf")?.value,
        doc = uploadedPdfs.find((x) => x.id === id),
        style = document.querySelector("#summary-style")?.value || "cram";
    if (!doc?.text) {
        showToast("Select a PDF with extracted text.");
        return;
    }
    let html = buildPdfGuide(doc.text, doc.name, style);
    closeModal();
    openStudyDocument(html, doc.name);
    trackInteraction();
}
function summarizeSpecificPdf(id) {
    let doc = uploadedPdfs.find((x) => x.id === id);
    if (!doc?.text) {
        showToast("This PDF is still being scanned.");
        return;
    }
    openStudyDocument(buildPdfGuide(doc.text, doc.name, "deep"), doc.name);
    trackInteraction();
}
function scanPdf() {
    uploadPdf(true);
}
function changeMonth(d) {
    state.month += d;
    if (state.month < 0) {
        state.month = 11;
        state.year--;
    }
    if (state.month > 11) {
        state.month = 0;
        state.year++;
    }
    state.selectedCalendarDate = null;
    renderApp();
}
function subjectColor(subject) {
    let s = (subject || "").toLowerCase();
    if (s.includes("biology") || s.includes("bio")) return "#9166a0";
    if (s.includes("chem")) return "#4f8b78";
    if (s.includes("hist")) return "#bd765d";
    if (s.includes("math")) return "#5e7eae";
    return "#b08a45";
}
function eventTime(e) {
    let start = e.startTime || e.time || "09:00",
        end = e.endTime || "";
    return `${start}${end ? `–${end}` : ""}`;
}
function schedule() {
    if (state.user?.plan !== "Duo")
        return locked(
            "Course planner",
            "Plan classes, exams, and study blocks in one flexible calendar. Upgrade to Duo to unlock the course planner.",
        );
    let first = new Date(state.year, state.month, 1),
        offset = (first.getDay() + 6) % 7,
        days = new Date(state.year, state.month + 1, 0).getDate(),
        chosen =
            state.selectedCalendarDate ||
            dayKey(
                new Date(state.year, state.month, Math.min(new Date().getDate(), days)),
            ),
        cells = Array.from({ length: 42 }, (_, i) => {
            let day = i - offset + 1;
            if (day < 1 || day > days) return '<div class="cal-cell"></div>';
            let key = dayKey(new Date(state.year, state.month, day)),
                evs = calendarEvents.filter((e) => e.date === key),
                taskList = state.tasks.filter((t) => t.calendarDate === key);
            return `<div class="cal-cell day-cell ${chosen === key ? "selected" : ""}" onclick="selectCalendarDay('${key}')"><b>${day}</b>${evs
                .slice(0, 3)
                .map(
                    (e) =>
                        `<span class="event-chip" style="--subject-color:${subjectColor(e.subject)};--event-color:${esc(e.color || "#d9bedf")}" title="${esc(e.subject)} · ${esc(e.title)} · ${eventTime(e)}">${esc(e.startTime || e.time || "")} ${esc(e.title)}</span>`,
                )
                .join("")}${taskList
                .slice(0, 1)
                .map(
                    (t) =>
                        `<span class="event-chip task-chip" title="Task deadline">${esc(t.title)}</span>`,
                )
                .join(
                    "",
                )}${evs.length + taskList.length > 3 ? `<small>+${evs.length + taskList.length - 3} more</small>` : ""}</div>`;
        }).join(""),
        today = dayKey(new Date()),
        events = calendarEvents
            .filter((e) => e.date >= today)
            .sort((a, b) =>
                (a.date + (a.startTime || a.time || "")).localeCompare(
                    b.date + (b.startTime || b.time || ""),
                ),
            ),
        courses = ["Biology 204", "Chemistry Lab", "HIST 110"];
    return `<div class="calendar-toolbar"><button class="iconbtn" onclick="changeMonth(-1)">←</button><h3 style="margin:0">${new Date(state.year, state.month).toLocaleString("en", { month: "long", year: "numeric" })}</h3><div><button class="iconbtn" onclick="changeMonth(1)">→</button> <button class="btn small" onclick="addCalendarEvent('${chosen}')">＋ Add event</button></div></div><div class="subject-key-row">${courses.map((c) => `<span class="subject-key"><i style="--key-color:${subjectColor(c)}"></i>${esc(c)}</span>`).join("")}<span class="subject-key"><i style="--key-color:${subjectColor("Other")}"></i>Other</span></div><div class="calendar-layout"><div class="card"><div class="calendar-grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => `<div class="cal-cell head">${d}</div>`).join("")}${cells}</div><p class="subtitle" style="margin-top:12px">Select a date to view or add events. Selected: <b>${new Date(chosen + "T12:00:00").toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</b></p><button class="btn light small" onclick="addCalendarEvent('${chosen}')">＋ Add event on selected date</button></div><aside class="card event-list calendar-agenda"><div class="eyebrow">PLANNER</div><h3 style="margin-top:8px">Agenda</h3><div class="agenda-tabs"><button class="${state.agendaTab !== "tasks" ? "active" : ""}" onclick="state.agendaTab='events';renderApp()">Events · ${events.length}</button><button class="${state.agendaTab === "tasks" ? "active" : ""}" onclick="state.agendaTab='tasks';renderApp()">Tasks · ${state.tasks.length}</button></div>${state.agendaTab === "tasks" ? state.tasks.map((t, i) => `<div class="agenda-task ${state.completed.includes(i) ? "done" : ""}"><input type="checkbox" ${state.completed.includes(i) ? "checked" : ""} onchange="toggleTask(${i})"><span><b>${esc(t.title)}</b><small>${esc(t.course)} · ${esc(t.date)}</small></span><button class="deadline-delete" onclick="removeTask(${i})" title="Delete task">×</button></div>`).join("") || '<p class="subtitle">No tasks in your tracker.</p>' : events.map((e) => `<article class="agenda-event" style="--subject-color:${subjectColor(e.subject)};--event-color:${esc(e.color || "#d9bedf")}"><b>${esc(e.title)}</b><small>${new Date(e.date + "T12:00:00").toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })} · <span class="agenda-time">${eventTime(e)}</span></small><small>${esc(e.subject)}</small><div class="agenda-actions"><button class="linkbutton" onclick="selectCalendarDay('${e.date}')">Show date</button><span><button class="linkbutton" onclick="editCalendarEvent('${e.id}')">Edit</button><button class="linkbutton" onclick="deleteCalendarEvent('${e.id}')">Delete</button></span></div></article>`).join("") || '<p class="subtitle">No events yet. Add an event from the calendar.</p>'}</aside></div><section class="card" style="margin-top:17px"><div class="card-head"><h3>Course progress</h3><span class="eyebrow">Updates from task tracker</span></div><div class="course-progress-grid">${courses
        .map((course) => {
            let links = state.tasks
                    .map((t, i) => ({ t, i }))
                    .filter(
                        (x) =>
                            x.t.course.toLowerCase().includes(course.toLowerCase()) ||
                            course.toLowerCase().includes(x.t.course.toLowerCase()),
                    ),
                done = links.filter((x) => state.completed.includes(x.i)).length,
                pct = links.length ? Math.round((done / links.length) * 100) : 0;
            return `<div class="course-progress-card"><b>${esc(course)}</b><small>${links.length ? `${done} of ${links.length} linked tasks complete` : "No linked assignments yet"}</small><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><button class="linkbutton" onclick="go('tasks')">View tasks →</button></div>`;
        })
        .join("")}</div></section>`;
}
function addCalendarEvent(key, id) {
    let old = id ? calendarEvents.find((e) => e.id === id) : null,
        day = key || state.selectedCalendarDate || dayKey(new Date()),
        known = [
            "Biology 204",
            "Chemistry Lab",
            "HIST 110",
            "Mathematics",
            "Other",
        ],
        selected = old?.subject || "Biology 204",
        isKnown = known.includes(selected);
    showModal(
        `<h2>${old ? "Edit calendar event" : "Add calendar event"}</h2><p>Set a subject category and start/end time for your event.</p><form onsubmit="saveCalendarEvent(event)"><input type="hidden" name="id" value="${esc(old?.id || "")}"><div class="field"><label>Subject</label><select name="subject" id="event-subject" onchange="document.querySelector('#other-subject-field').classList.toggle('hidden',this.value!=='Other')">${known.map((s) => `<option ${s === (isKnown ? selected : "Other") ? "selected" : ""}>${s}</option>`).join("")}</select></div><div class="field ${isKnown ? "hidden" : ""}" id="other-subject-field"><label>Custom subject</label><input name="customSubject" value="${isKnown ? "" : esc(selected)}" placeholder="Enter a subject"></div><div class="field"><label>Event title</label><input name="title" required value="${esc(old?.title || "")}" placeholder="Lecture, exam, study block"></div><div class="field"><label>Day</label><input name="date" type="date" required value="${esc(old?.date || day)}"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Start time</label><input name="startTime" type="time" required value="${esc(old?.startTime || old?.time || "09:00")}"></div><div class="field"><label>End time</label><input name="endTime" type="time" required value="${esc(old?.endTime || "10:00")}"></div></div><div class="field"><label>Calendar color</label><select name="color"><option value="${subjectColor(selected)}">Match subject · ${esc(selected)}</option>${[
            ["#9166a0", "Lavender"],
            ["#4f8b78", "Sage"],
            ["#bd765d", "Terracotta"],
            ["#5e7eae", "Blue"],
            ["#b08a45", "Gold"],
        ]
            .map(
                ([v, l]) =>
                    `<option value="${v}" ${old?.color === v ? "selected" : ""}>${l}</option>`,
            )
            .join(
                "",
            )}</select></div><button class="btn">${old ? "Save changes" : "Add to calendar"}</button></form>`,
    );
}
function saveCalendarEvent(event) {
    event.preventDefault();
    let f = new FormData(event.target),
        subject =
            f.get("subject") === "Other"
                ? f.get("customSubject").trim()
                : f.get("subject"),
        start = f.get("startTime"),
        end = f.get("endTime");
    if (!subject) {
        showToast("Add a subject category.");
        return;
    }
    if (end <= start) {
        showToast("End time must be later than start time.");
        return;
    }
    let id = f.get("id"),
        previous = calendarEvents.find((e) => e.id === id),
        item = {
            id: id || "event-" + Date.now(),
            subject,
            title: f.get("title").trim(),
            date: f.get("date"),
            startTime: start,
            endTime: end,
            color: f.get("color") || subjectColor(subject),
        };
    if (previous)
        calendarEvents = calendarEvents.map((e) => (e.id === id ? item : e));
    else calendarEvents.push(item);
    calendarEvents.sort((a, b) =>
        (a.date + a.startTime).localeCompare(b.date + b.startTime),
    );
    persistCalendar();
    state.year = Number(item.date.slice(0, 4));
    state.month = Number(item.date.slice(5, 7)) - 1;
    state.selectedCalendarDate = item.date;
    state.agendaTab = "events";
    closeModal();
    renderApp();
    showToast(previous ? "Calendar event updated." : "Calendar event added.");
}
function editCalendarEvent(id) {
    let e = calendarEvents.find((x) => x.id === id);
    if (e) addCalendarEvent(e.date, id);
}
const baseSubjects = [
    "Biology 204",
    "Chemistry Lab",
    "HIST 110",
    "Mathematics",
];
let customSubjects = JSON.parse(
    localStorage.getItem("idealibSubjects") || "[]",
);
function subjectNames() {
    return [...new Set([...baseSubjects, ...customSubjects.map((x) => x.name)])];
}
function rememberSubject(name, color) {
    name = (name || "").trim();
    if (!name) return;
    let i = customSubjects.findIndex(
        (x) => x.name.toLowerCase() === name.toLowerCase(),
    );
    if (i < 0) customSubjects.push({ name, color: color || "#8b638e" });
    else if (color) customSubjects[i].color = color;
    localStorage.setItem("idealibSubjects", JSON.stringify(customSubjects));
}
function subjectColor(subject) {
    let custom = customSubjects.find(
        (x) => x.name.toLowerCase() === String(subject || "").toLowerCase(),
    );
    if (custom?.color) return custom.color;
    let s = (subject || "").toLowerCase();
    if (s.includes("biology") || s.includes("bio")) return "#9166a0";
    if (s.includes("chem")) return "#4f8b78";
    if (s.includes("hist")) return "#bd765d";
    if (s.includes("math")) return "#5e7eae";
    return "#b08a45";
}
function subjectList(id) {
    return `<datalist id="${id}">${subjectNames()
        .map((x) => `<option value="${esc(x)}">`)
        .join("")}</datalist>`;
}
function syncHexColor(hexId, pickerId) {
    let h = document.getElementById(hexId),
        p = document.getElementById(pickerId);
    if (h && p && /^#[0-9a-fA-F]{6}$/.test(h.value)) p.value = h.value;
}
function updateHexFromPicker(pickerId, hexId) {
    let p = document.getElementById(pickerId),
        h = document.getElementById(hexId);
    if (p && h) h.value = p.value;
}
function manageSubjects() {
    showModal(
        `<h2>Manage subjects</h2><p>Edit a subject’s name and color. Updates carry through notes, tasks, deadlines, and calendar events.</p><form onsubmit="addCustomSubject(event)"><div class="field"><label>Add a subject</label><input name="name" required placeholder="e.g. Psychology 101"></div><div class="field"><label>Subject color</label><div style="display:flex;gap:10px;align-items:center"><input name="color" id="sub-color" type="color" value="#8b638e" onchange="updateHexFromPicker('sub-color','sub-hex')"><input id="sub-hex" value="#8b638e" pattern="^#[0-9A-Fa-f]{6}$" maxlength="7" oninput="syncHexColor('sub-hex','sub-color')" style="padding:9px;border:1px solid var(--line);border-radius:8px;width:120px"></div></div><button class="btn">Add subject</button></form><h3 style="margin:20px 0 8px">Your subjects</h3><div style="max-height:42vh;overflow:auto;padding-right:4px">${subjectNames()
            .map(
                (s, i) =>
                    `<form class="file-row subject-edit-row" style="display:grid;grid-template-columns:minmax(120px,1fr) 42px 110px auto auto;gap:9px;align-items:center;margin:8px 0" onsubmit="saveSubjectEdit(event,${i})"><input type="hidden" name="oldName" value="${esc(s)}"><input name="name" value="${esc(s)}" aria-label="Subject name"><input id="subject-picker-${i}" type="color" value="${subjectColor(s)}" onchange="updateHexFromPicker('subject-picker-${i}','subject-hex-${i}')" aria-label="Subject color"><input id="subject-hex-${i}" name="color" value="${subjectColor(s)}" pattern="^#[0-9A-Fa-f]{6}$" maxlength="7" oninput="syncHexColor('subject-hex-${i}','subject-picker-${i}')" aria-label="Subject hex color"><button class="btn light small">Save</button>${customSubjects.some((x) => x.name === s) ? `<button type="button" class="linkbutton" onclick="removeSubject('${esc(s)}')">Remove</button>` : ""}</form>`,
            )
            .join("")}</div>`,
    );
}
function saveSubjectEdit(e, oldName) {
    e.preventDefault();
    let f = new FormData(e.target);
    oldName = String(f.get("oldName") || "");
    let name = String(f.get("name") || "").trim(),
        color = String(f.get("color") || "");
    if (!name) {
        showToast("Subject name is required.");
        return;
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
        showToast("Enter a valid six-digit hex color.");
        return;
    }
    if (
        subjectNames().some(
            (s) => s.toLowerCase() === name.toLowerCase() && s !== oldName,
        )
    ) {
        showToast("Another subject already uses that name.");
        return;
    }
    let root = baseSubjects.find((x) => (renamedSubjects[x] || x) === oldName);
    if (root) renamedSubjects[root] = name;
    else {
        let custom = customSubjects.find((x) => x.name === oldName);
        if (custom) custom.name = name;
        else rememberSubject(name, color);
    }
    customSubjects = customSubjects.map((x) =>
        x.name === name ? { ...x, color } : x,
    );
    state.tasks.forEach((t) => {
        if (t.course === oldName) t.course = name;
    });
    calendarEvents.forEach((x) => {
        if (x.subject === oldName) x.subject = name;
    });
    notes.forEach((n) => {
        if (n[0] === oldName) n[0] = name;
    });
    if (state.noteFolder === oldName) state.noteFolder = name;
    if (state.deadlineSubject === oldName) state.deadlineSubject = name;
    subjectColorOverrides[name] = color;
    delete subjectColorOverrides[oldName];
    localStorage.setItem("idealibSubjectNames", JSON.stringify(renamedSubjects));
    localStorage.setItem(
        "idealibSubjectColors",
        JSON.stringify(subjectColorOverrides),
    );
    localStorage.setItem("idealibSubjects", JSON.stringify(customSubjects));
    persistTasks();
    persistCalendar();
    renderApp();
    manageSubjects();
    showToast("Subject updated across your workspace.");
}
function addCustomSubject(e) {
    e.preventDefault();
    let f = new FormData(e.target),
        name = f.get("name").trim(),
        color = f.get("color");
    if (subjectNames().some((s) => s.toLowerCase() === name.toLowerCase())) {
        showToast("That subject already exists.");
        return;
    }
    rememberSubject(name, color);
    manageSubjects();
    showToast("Subject added.");
}
function removeSubject(name) {
    customSubjects = customSubjects.filter((s) => s.name !== name);
    localStorage.setItem("idealibSubjects", JSON.stringify(customSubjects));
    manageSubjects();
}
function addTask() {
    let d = new Date();
    d.setDate(d.getDate() + 1);
    showModal(
        `<h2>Add an assignment</h2><p>Assignments added here also appear on their calendar date.</p><form onsubmit="saveTask(event)"><div class="field"><label>Task title</label><input name="title" required placeholder="e.g. Review lecture notes"></div><div class="field"><label>Subject</label><input name="course" list="task-subject-list" required placeholder="Choose or type a subject">${subjectList("task-subject-list")}<button type="button" class="linkbutton" onclick="manageSubjects()">＋ Manage subjects</button></div><div class="field"><label>Due day</label><input name="date" type="date" required value="${dayKey(d)}"></div><button class="btn">Add assignment</button></form>`,
    );
}
function saveTask(e) {
    e.preventDefault();
    let f = new FormData(e.target),
        date = f.get("date"),
        course = f.get("course").trim();
    rememberSubject(course);
    state.tasks.unshift({
        title: f.get("title").trim(),
        course,
        date: new Date(date + "T12:00:00").toLocaleDateString("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }),
        calendarDate: date,
        due: "Upcoming",
    });
    persistTasks();
    closeModal();
    renderApp();
    trackInteraction();
    showToast("Assignment added to the task tracker and calendar.");
}
function newNote() {
    showModal(
        `<h2>New note</h2><p>Save your notes under a reusable subject.</p><form onsubmit="saveNote(event)"><div class="field"><label>Subject</label><input name="course" list="note-subject-list" required placeholder="Choose or type a subject">${subjectList("note-subject-list")}<button type="button" class="linkbutton" onclick="manageSubjects()">＋ Manage subjects</button></div><div class="field"><label>Note title</label><input name="title" required placeholder="A useful idea"></div><div class="field"><label>Your note</label><textarea name="body" rows="5" required placeholder="Write your notes..." style="padding:12px;border:1px solid var(--line);border-radius:10px"></textarea></div><button class="btn">Save note</button></form>`,
    );
}
function saveNote(e) {
    e.preventDefault();
    let f = new FormData(e.target),
        course = f.get("course").trim(),
        title = f.get("title").trim(),
        body = f.get("body").trim();
    rememberSubject(course);
    let grid = document.querySelector("#notes-grid");
    if (grid)
        grid.insertAdjacentHTML(
            "afterbegin",
            `<article class="note-card"><span class="tag" style="background:${subjectColor(course)}22;color:${subjectColor(course)}">${esc(course)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`,
        );
    closeModal();
    trackInteraction();
    showToast("Note saved under " + course + ".");
}
function addCalendarEvent(key, id) {
    let old = id ? calendarEvents.find((e) => e.id === id) : null,
        day = key || state.selectedCalendarDate || dayKey(new Date()),
        color = old?.color || subjectColor(old?.subject || "Biology 204");
    showModal(
        `<h2>${old ? "Edit calendar event" : "Add calendar event"}</h2><form onsubmit="saveCalendarEvent(event)"><input type="hidden" name="id" value="${esc(old?.id || "")}"><div class="field"><label>Subject</label><input name="subject" list="event-subject-list" required value="${esc(old?.subject || "")}" placeholder="Choose or type a subject">${subjectList("event-subject-list")}<button type="button" class="linkbutton" onclick="manageSubjects()">＋ Manage subjects</button></div><div class="field"><label>Event title</label><input name="title" required value="${esc(old?.title || "")}" placeholder="Lecture, exam, study block"></div><div class="field"><label>Day</label><input name="date" type="date" required value="${esc(old?.date || day)}"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Start time</label><input name="startTime" type="time" required value="${esc(old?.startTime || old?.time || "09:00")}"></div><div class="field"><label>End time</label><input name="endTime" type="time" required value="${esc(old?.endTime || "10:00")}"></div></div><div class="field"><label>Event color · hex</label><div style="display:flex;gap:10px;align-items:center"><input id="event-color-picker" type="color" value="${color}" onchange="updateHexFromPicker('event-color-picker','event-color-hex')"><input id="event-color-hex" name="color" value="${color}" pattern="^#[0-9A-Fa-f]{6}$" maxlength="7" required oninput="syncHexColor('event-color-hex','event-color-picker')" style="padding:9px;border:1px solid var(--line);border-radius:8px;width:120px"></div></div><button class="btn">${old ? "Save changes" : "Add to calendar"}</button></form>`,
    );
}
function saveCalendarEvent(e) {
    e.preventDefault();
    let f = new FormData(e.target),
        subject = f.get("subject").trim(),
        start = f.get("startTime"),
        end = f.get("endTime"),
        color = f.get("color").trim();
    if (!subject) {
        showToast("Add a subject.");
        return;
    }
    if (end <= start) {
        showToast("End time must be later than start time.");
        return;
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
        showToast("Enter a valid hex color, such as #8B638E.");
        return;
    }
    let id = f.get("id"),
        old = calendarEvents.find((x) => x.id === id),
        item = {
            id: id || "event-" + Date.now(),
            subject,
            title: f.get("title").trim(),
            date: f.get("date"),
            startTime: start,
            endTime: end,
            color,
        };
    rememberSubject(subject, color);
    calendarEvents = old
        ? calendarEvents.map((x) => (x.id === id ? item : x))
        : [...calendarEvents, item];
    calendarEvents.sort((a, b) =>
        (a.date + a.startTime).localeCompare(b.date + b.startTime),
    );
    persistCalendar();
    state.year = Number(item.date.slice(0, 4));
    state.month = Number(item.date.slice(5, 7)) - 1;
    state.selectedCalendarDate = item.date;
    closeModal();
    renderApp();
    showToast(old ? "Event updated." : "Event added.");
}
function schedule() {
    let html = scheduleBaseForSubjects();
    return html;
}
function scheduleBaseForSubjects() {
    if (state.user?.plan !== "Duo")
        return locked(
            "Course planner",
            "Plan classes, exams, and study blocks in one flexible calendar. Upgrade to Duo to unlock the course planner.",
        );
    let first = new Date(state.year, state.month, 1),
        offset = (first.getDay() + 6) % 7,
        days = new Date(state.year, state.month + 1, 0).getDate(),
        chosen =
            state.selectedCalendarDate ||
            dayKey(
                new Date(state.year, state.month, Math.min(new Date().getDate(), days)),
            ),
        cells = Array.from({ length: 42 }, (_, i) => {
            let d = i - offset + 1;
            if (d < 1 || d > days) return '<div class="cal-cell"></div>';
            let key = dayKey(new Date(state.year, state.month, d)),
                ev = calendarEvents.filter((e) => e.date === key),
                due = state.tasks.filter((t) => t.calendarDate === key);
            return `<div class="cal-cell day-cell ${chosen === key ? "selected" : ""}" onclick="selectCalendarDay('${key}')"><b>${d}</b>${ev
                .slice(0, 2)
                .map(
                    (e) =>
                        `<span class="event-chip" style="--subject-color:${subjectColor(e.subject)};--event-color:${esc(e.color || "#d9bedf")}"><span class="chip-time">${eventTime(e)}</span><b>${esc(e.title)}</b><small>${esc(e.subject)}</small></span>`,
                )
                .join("")}${due
                .slice(0, 2)
                .map(
                    (t) =>
                        `<span class="event-chip task-chip" style="--event-color:${subjectColor(t.course)}" title="Task deadline"><b>${esc(t.title)}</b><small>${esc(t.course)}</small></span>`,
                )
                .join("")}</div>`;
        }).join("");
    let upcoming = calendarEvents
        .filter((e) => e.date >= dayKey(new Date()))
        .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime));
    return `<div class="calendar-toolbar"><button class="iconbtn" onclick="changeMonth(-1)">←</button><h3 style="margin:0">${new Date(state.year, state.month).toLocaleString("en", { month: "long", year: "numeric" })}</h3><div><button class="iconbtn" onclick="changeMonth(1)">→</button> <button class="btn small" onclick="addCalendarEvent('${chosen}')">＋ Add event</button></div></div><div class="subject-key-row" style="margin:5px 0 12px">${subjectNames()
        .map(
            (s) =>
                `<span class="subject-key"><i style="--key-color:${subjectColor(s)}"></i>${esc(s)}</span>`,
        )
        .join(
            "",
        )}<button class="linkbutton" onclick="manageSubjects()">＋ Manage subjects & colors</button></div><div class="calendar-layout"><div class="card"><div class="calendar-grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => `<div class="cal-cell head">${x}</div>`).join("")}${cells}</div><p class="subtitle" style="margin-top:12px">Select a date to view or add events. Selected: <b>${new Date(chosen + "T12:00:00").toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</b></p><button class="btn light small" onclick="addCalendarEvent('${chosen}')">＋ Add event on selected date</button></div><aside class="card event-list calendar-agenda"><div class="eyebrow">UPCOMING</div><h3 style="margin-top:8px">Events & tasks</h3>${upcoming.map((e) => `<article class="agenda-event" style="--subject-color:${subjectColor(e.subject)};--event-color:${esc(e.color || "#d9bedf")}"><b>${esc(e.title)}</b><small>${new Date(e.date + "T12:00:00").toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })} · <span class="agenda-time">${eventTime(e)}</span></small><small>${esc(e.subject)}</small><button class="linkbutton" onclick="editCalendarEvent('${e.id}')">Edit</button> <button class="linkbutton" onclick="deleteCalendarEvent('${e.id}')">Delete</button></article>`).join("")}${state.tasks.map((t, i) => `<div class="agenda-task ${state.completed.includes(i) ? "done" : ""}"><input type="checkbox" ${state.completed.includes(i) ? "checked" : ""} onchange="toggleTask(${i})"><span><b>${esc(t.title)}</b><small>${esc(t.course)} · ${esc(t.date)}</small></span><button class="deadline-delete" onclick="removeTask(${i})">×</button></div>`).join("") || '<p class="subtitle">No tasks yet.</p>'}</aside></div>`;
}
function backfillTaskDates() {
    let changed = false,
        now = new Date();
    state.tasks.forEach((t) => {
        if (t.calendarDate) return;
        let d = new Date(now);
        if (/tomorrow/i.test(t.date || "")) d.setDate(d.getDate() + 1);
        else if (/friday/i.test(t.date || "")) {
            let add = (5 - d.getDay() + 7) % 7 || 7;
            d.setDate(d.getDate() + add);
        } else if (!/today/i.test(t.date || "")) return;
        t.calendarDate = dayKey(d);
        changed = true;
    });
    if (changed)
        localStorage.setItem("idealibTasks", JSON.stringify(state.tasks));
}
backfillTaskDates();
let eventsBeforeClean = calendarEvents.length;
calendarEvents = calendarEvents.filter(
    (e) =>
        !(
            e.date === "2026-10-01" &&
            String(e.title || "")
                .trim()
                .toLowerCase() === "study" &&
            (e.startTime || e.time) === "09:00"
        ),
);
if (calendarEvents.length !== eventsBeforeClean) persistCalendar();
function addCalendarEvent(key, id) {
    let old = id ? calendarEvents.find((e) => e.id === id) : null,
        day = key || state.selectedCalendarDate || dayKey(new Date()),
        subject = old?.subject || "",
        accent = old?.color || "#d9bedf";
    showModal(
        `<h2>${old ? "Edit calendar event" : "Add calendar event"}</h2><p>Set the subject color as the main category color. The event hex color is a secondary accent.</p><form onsubmit="saveCalendarEvent(event)"><input type="hidden" name="id" value="${esc(old?.id || "")}"><div class="field"><label>Subject · main color</label><input name="subject" list="event-subject-list" required value="${esc(subject)}" placeholder="Choose or type a subject">${subjectList("event-subject-list")}<button type="button" class="linkbutton" onclick="manageSubjects()">＋ Manage subjects & colors</button></div><div class="field"><label>Event title</label><input name="title" required value="${esc(old?.title || "")}" placeholder="Lecture, exam, study block"></div><div class="field"><label>Day</label><input name="date" type="date" required value="${esc(old?.date || day)}"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Start time</label><input name="startTime" type="time" required value="${esc(old?.startTime || old?.time || "09:00")}"></div><div class="field"><label>End time</label><input name="endTime" type="time" required value="${esc(old?.endTime || "10:00")}"></div></div><div class="field"><label>Event accent · secondary hex color</label><div style="display:flex;gap:10px;align-items:center"><input id="event-color-picker" type="color" value="${accent}" onchange="updateHexFromPicker('event-color-picker','event-color-hex')"><input id="event-color-hex" name="color" value="${accent}" pattern="^#[0-9A-Fa-f]{6}$" maxlength="7" required oninput="syncHexColor('event-color-hex','event-color-picker')" style="padding:9px;border:1px solid var(--line);border-radius:8px;width:120px"></div></div><label style="display:flex;gap:9px;align-items:flex-start;margin:14px 0 18px;font-size:12px;line-height:1.5"><input type="checkbox" name="isDeadline" ${old?.isDeadline ? "checked" : ""}> Add this to Upcoming Deadlines and the Task Tracker</label><button class="btn">${old ? "Save changes" : "Add to calendar"}</button></form>`,
    );
}
function saveCalendarEvent(e) {
    e.preventDefault();
    let f = new FormData(e.target),
        subject = f.get("subject").trim(),
        start = f.get("startTime"),
        end = f.get("endTime"),
        color = f.get("color").trim(),
        isDeadline = f.get("isDeadline") === "on";
    if (!subject) {
        showToast("Add a subject.");
        return;
    }
    if (end <= start) {
        showToast("End time must be later than start time.");
        return;
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
        showToast("Enter a valid hex color.");
        return;
    }
    let id = f.get("id"),
        old = calendarEvents.find((x) => x.id === id),
        item = {
            id: id || "event-" + Date.now(),
            subject,
            title: f.get("title").trim(),
            date: f.get("date"),
            startTime: start,
            endTime: end,
            color,
            isDeadline,
        };
    rememberSubject(subject);
    calendarEvents = old
        ? calendarEvents.map((x) => (x.id === id ? item : x))
        : [...calendarEvents, item];
    let linked = state.tasks.find((t) => t.calendarEventId === item.id);
    if (isDeadline) {
        let dateText = new Date(item.date + "T12:00:00").toLocaleDateString("en", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        if (linked) {
            linked.title = item.title;
            linked.course = subject;
            linked.calendarDate = item.date;
            linked.date = `${dateText} · ${start}–${end}`;
        } else
            state.tasks.push({
                title: item.title,
                course: subject,
                calendarDate: item.date,
                date: `${dateText} · ${start}–${end}`,
                due: "Upcoming",
                calendarEventId: item.id,
            });
    } else if (linked) {
        let ix = state.tasks.indexOf(linked);
        state.tasks.splice(ix, 1);
        state.completed = state.completed
            .filter((n) => n !== ix)
            .map((n) => (n > ix ? n - 1 : n));
    }
    persistTasks();
    calendarEvents.sort((a, b) =>
        (a.date + a.startTime).localeCompare(b.date + b.startTime),
    );
    persistCalendar();
    state.year = Number(item.date.slice(0, 4));
    state.month = Number(item.date.slice(5, 7)) - 1;
    state.selectedCalendarDate = item.date;
    state.deadlineSubject = "All";
    closeModal();
    renderApp();
    showToast(
        isDeadline
            ? "Event added to calendar and upcoming deadlines."
            : "Calendar event saved.",
    );
}
function removeTask(i) {
    let t = state.tasks[i];
    if (t?.calendarEventId) {
        calendarEvents = calendarEvents.filter((e) => e.id !== t.calendarEventId);
        persistCalendar();
    }
    state.tasks.splice(i, 1);
    state.completed = state.completed
        .filter((x) => x !== i)
        .map((x) => (x > i ? x - 1 : x));
    persistTasks();
    renderApp();
    showToast("Task removed.");
}
function deleteCalendarEvent(id) {
    let linked = state.tasks.findIndex((t) => t.calendarEventId === id);
    if (linked >= 0) {
        state.tasks.splice(linked, 1);
        state.completed = state.completed
            .filter((x) => x !== linked)
            .map((x) => (x > linked ? x - 1 : x));
        persistTasks();
    }
    calendarEvents = calendarEvents.filter((e) => e.id !== id);
    persistCalendar();
    renderApp();
    showToast("Calendar event removed.");
}
function overview() {
    let order = state.tasks
            .map((task, i) => ({ task, i, done: state.completed.includes(i) }))
            .sort((a, b) => Number(a.done) - Number(b.done)),
        courses = subjectNames(),
        filter = state.deadlineSubject || "All",
        shown = order.filter(
            (x) =>
                filter === "All" ||
                x.task.course.toLowerCase() === filter.toLowerCase(),
        ),
        open = order.filter((x) => !x.done).length;
    return `<div class="action-row"><button class="btn" onclick="newNote()">＋ New note</button><button class="btn light" onclick="go('tools');scanPdf()">⇧ Scan PDF</button><button class="btn light" onclick="addTask()">＋ Add assignment</button><button class="btn light" onclick="go('library')">Open library</button></div><div class="stats"><div class="stat"><span>TASKS THIS WEEK</span><b>${state.completed.length}/${state.tasks.length}</b></div><div class="stat"><span>UPCOMING</span><b>${open}</b></div><div class="stat"><span>STUDY STREAK</span><b>${state.streak} <small style="font-size:12px">days</small></b></div></div><div class="dashboard-grid"><section class="card"><div class="card-head"><h3>Progress overview</h3><span class="eyebrow">Based on task completion</span></div>${courses
        .map((course) => {
            let linked = state.tasks
                    .map((t, i) => ({ t, i }))
                    .filter((x) => x.t.course.toLowerCase() === course.toLowerCase()),
                done = linked.filter((x) => state.completed.includes(x.i)).length,
                pct = linked.length ? Math.round((done / linked.length) * 100) : 0;
            return `<div class="progress-row"><div class="progress-label"><b style="color:${subjectColor(course)}">${esc(course)}</b><span>${linked.length ? `${pct}% · ${done}/${linked.length} tasks` : "No linked tasks"}</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${subjectColor(course)}"></div></div></div>`;
        })
        .join(
            "",
        )}<button class="linkbutton" onclick="go('schedule')">Open course planner →</button></section><section class="card"><div class="card-head"><h3>Upcoming deadlines</h3><button class="linkbutton" onclick="go('tasks')">See all</button></div><div class="subject-filter-row"><button class="subject-filter ${filter === "All" ? "active" : ""}" onclick="state.deadlineSubject='All';renderApp()">All subjects</button>${courses.map((c) => `<button class="subject-filter ${filter.toLowerCase() === c.toLowerCase() ? "active" : ""}" style="--subject-color:${subjectColor(c)}" onclick="state.deadlineSubject='${esc(c)}';renderApp()">${esc(c)}</button>`).join("")}</div>${shown.length ? shown.map(({ task: t, i, done }) => `<div class="week-item ${done ? "done" : ""}" onclick="toggleTask(${i})"><input type="checkbox" ${done ? "checked" : ""} aria-label="Mark ${esc(t.title)} ${done ? "incomplete" : "complete"}" onclick="event.stopPropagation()" onchange="toggleTask(${i})"><span><b class="deadline-title">${esc(t.title)}</b><small class="deadline-subject" style="--subject-color:${subjectColor(t.course)}">${esc(t.course)}</small></span><span class="due">${esc(done ? "Done" : t.date)}</span><button class="linkbutton" onclick="event.stopPropagation();editPlannerEntry(${i})">Edit</button><button class="deadline-delete" onclick="event.stopPropagation();removeTask(${i})">Delete</button></div>`).join("") : '<p class="subtitle">No deadlines for this subject.</p>'}</section></div><div class="bottom-grid"><section class="card timer-card"><div><span class="eyebrow" style="color:#e4cee5">FOCUS SESSION · POMODORO</span><h3>Ready for a deep dive?</h3><div class="timer-num" id="timer-num">${formatTime(state.timer)}</div></div><div class="timer-controls"><button onclick="toggleTimer()" id="timer-button">${state.timerRunning ? "Pause" : "Start focus"}</button><button onclick="resetTimer()">Reset</button><button onclick="go('tools')">Timer settings</button></div></section><section class="card"><div class="card-head"><h3>This week</h3><span class="eyebrow">Your momentum</span></div><ul class="activity-list"><li><span class="dot"></span>${open} tasks remain <span style="margin-left:auto;color:var(--muted)">This week</span></li><li><span class="dot" style="background:#91a48c"></span>Focus timer ready <span style="margin-left:auto;color:var(--muted)">Now</span></li></ul></section></div>`;
}
let cleanedLegacyEvents = calendarEvents.length;
calendarEvents = calendarEvents.filter(
    (x) =>
        !(
            x.date === "2026-10-01" &&
            String(x.title || "")
                .trim()
                .toLowerCase() === "study" &&
            (x.startTime || x.time) === "09:00"
        ),
);
if (cleanedLegacyEvents !== calendarEvents.length) persistCalendar();
function migrateEntryKinds() {
    let changed = false,
        linkedIds = new Set(
            state.tasks.map((t) => t.calendarEventId).filter(Boolean),
        );
    state.tasks.forEach((t) => {
        if (!t.kind) {
            t.kind = t.calendarEventId ? "deadline" : "deadline";
            changed = true;
        }
        if (t.calendarEventId) {
            t.calendarEntryId = t.calendarEventId;
            delete t.calendarEventId;
            changed = true;
        }
    });
    calendarEvents = calendarEvents.filter((e) => {
        if (linkedIds.has(e.id)) {
            changed = true;
            return false;
        }
        if (!e.kind) {
            e.kind = "event";
            changed = true;
        }
        return true;
    });
    if (changed) {
        persistTasks();
        persistCalendar();
    }
}
migrateEntryKinds();
state.tasks.forEach((t) => {
    if (!t.kind) t.kind = "deadline";
});
function reindexCompletedAfterRemoval(i) {
    state.completed = state.completed
        .filter((x) => x !== i)
        .map((x) => (x > i ? x - 1 : x));
}
function removeTask(i) {
    let task = state.tasks[i];
    if (task?.calendarEntryId) {
        calendarEvents = calendarEvents.filter(
            (e) => e.id !== task.calendarEntryId,
        );
        persistCalendar();
    }
    state.tasks.splice(i, 1);
    reindexCompletedAfterRemoval(i);
    persistTasks();
    renderApp();
    showToast("Item removed.");
}
function tasksPage() {
    let list = state.tasks
        .map((t, i) => ({ t, i }))
        .filter((x) => (x.t.kind || "task") === "task");
    return `<div class="action-row"><button class="btn" onclick="addTask()">＋ Add task</button><button class="btn light small" onclick="manageSubjects()">Manage subjects</button><span class="eyebrow" style="align-self:center">${list.filter((x) => !state.completed.includes(x.i)).length} open tasks</span></div>${list.length ? `<div class="task-board">${list.map(({ t, i }) => `<article class="task-sticky ${state.completed.includes(i) ? "done" : ""}"><button class="remove-task" style="position:absolute;right:12px;top:8px" onclick="removeTask(${i})" aria-label="Remove task">×</button><label><input type="checkbox" ${state.completed.includes(i) ? "checked" : ""} onchange="toggleTask(${i})"> <span class="eyebrow" style="color:${subjectColor(t.course)}">${esc(t.course)}</span></label><h3>${esc(t.title)}</h3><p>Task · ${esc(t.date || "No due date")}</p><footer><span>${esc(t.course)}</span><span>${state.completed.includes(i) ? "Done ✓" : "To do"}</span></footer></article>`).join("")}</div>` : '<section class="card" style="text-align:center;padding:46px"><h3>Your task list is clear</h3><p class="subtitle">Add a task here. Calendar deadlines stay in Upcoming Deadlines.</p><button class="btn" onclick="addTask()">＋ Add task</button></section>'}`;
}
function addTask() {
    let d = new Date();
    d.setDate(d.getDate() + 1);
    showModal(
        `<h2>Add a task</h2><p>Tasks live in Task Tracker. Add calendar deadlines separately from the Calendar.</p><form onsubmit="saveTask(event)"><div class="field"><label>Task title</label><input name="title" required placeholder="e.g. Review lecture notes"></div><div class="field"><label>Subject</label><input name="course" list="task-subject-list" required placeholder="Choose or type a subject">${subjectList("task-subject-list")}<button type="button" class="linkbutton" onclick="manageSubjects()">＋ Manage subjects</button></div><div class="field"><label>Due date (optional)</label><input name="date" type="date" value="${dayKey(d)}"></div><button class="btn">Add task</button></form>`,
    );
}
function saveTask(e) {
    e.preventDefault();
    let f = new FormData(e.target),
        date = f.get("date"),
        course = f.get("course").trim();
    rememberSubject(course);
    state.tasks.push({
        kind: "task",
        title: f.get("title").trim(),
        course,
        date: date
            ? new Date(date + "T12:00:00").toLocaleDateString("en", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })
            : "No due date",
        calendarDate: date || "",
        due: "Task",
    });
    persistTasks();
    closeModal();
    renderApp();
    trackInteraction();
    showToast("Task added to Task Tracker.");
}
function addCalendarEvent(key, id) {
    let old = id ? calendarEvents.find((e) => e.id === id) : null,
        day = key || state.selectedCalendarDate || dayKey(new Date()),
        accent = old?.color || "#d9bedf";
    showModal(
        `<h2>${old ? "Edit calendar item" : "Add calendar item"}</h2><p>Choose where this item belongs. Tasks and deadlines appear in separate panels.</p><form onsubmit="saveCalendarEvent(event)"><input type="hidden" name="id" value="${esc(old?.id || "")}"><div class="field"><label>Type</label><select name="kind"><option value="event" ${old?.kind !== "task" && old?.kind !== "deadline" ? "selected" : ""}>Calendar event</option><option value="task" ${old?.kind === "task" ? "selected" : ""}>Task · Task Tracker</option><option value="deadline" ${old?.kind === "deadline" || old?.isDeadline ? "selected" : ""}>Deadline · Upcoming Deadlines</option></select></div><div class="field"><label>Subject</label><input name="subject" list="event-subject-list" required value="${esc(old?.subject || "")}" placeholder="Choose or type a subject">${subjectList("event-subject-list")}<button type="button" class="linkbutton" onclick="manageSubjects()">＋ Manage subjects & colors</button></div><div class="field"><label>Title</label><input name="title" required value="${esc(old?.title || "")}"></div><div class="field"><label>Date</label><input name="date" type="date" required value="${esc(old?.date || day)}"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Start time</label><input name="startTime" type="time" required value="${esc(old?.startTime || old?.time || "09:00")}"></div><div class="field"><label>End time</label><input name="endTime" type="time" required value="${esc(old?.endTime || "10:00")}"></div></div><div class="field"><label>Secondary event accent · hex</label><div style="display:flex;gap:10px;align-items:center"><input id="event-color-picker" type="color" value="${accent}" onchange="updateHexFromPicker('event-color-picker','event-color-hex')"><input id="event-color-hex" name="color" value="${accent}" maxlength="7" pattern="^#[0-9A-Fa-f]{6}$" required oninput="syncHexColor('event-color-hex','event-color-picker')" style="padding:9px;border:1px solid var(--line);border-radius:8px;width:120px"></div></div><button class="btn">${old ? "Save changes" : "Add to calendar"}</button></form>`,
    );
}
function saveCalendarEvent(e) {
    e.preventDefault();
    let f = new FormData(e.target),
        kind = f.get("kind"),
        subject = f.get("subject").trim(),
        start = f.get("startTime"),
        end = f.get("endTime"),
        color = f.get("color").trim(),
        id = f.get("id") || "entry-" + Date.now();
    if (!subject) {
        showToast("Add a subject.");
        return;
    }
    if (end <= start) {
        showToast("End time must be later than start time.");
        return;
    }
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
        showToast("Enter a valid hex color.");
        return;
    }
    let item = {
        id,
        kind,
        subject,
        title: f.get("title").trim(),
        date: f.get("date"),
        startTime: start,
        endTime: end,
        color,
    };
    rememberSubject(subject);
    calendarEvents = calendarEvents.filter((x) => x.id !== id);
    let linked = state.tasks.find((t) => t.calendarEntryId === id);
    if (kind === "event") {
        calendarEvents.push(item);
        if (linked) {
            let ix = state.tasks.indexOf(linked);
            state.tasks.splice(ix, 1);
            reindexCompletedAfterRemoval(ix);
        }
    } else {
        let dateText = new Date(item.date + "T12:00:00").toLocaleDateString("en", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
            record = {
                kind,
                title: item.title,
                course: subject,
                date: `${dateText} · ${start}–${end}`,
                calendarDate: item.date,
                startTime: start,
                endTime: end,
                due: kind === "deadline" ? "Deadline" : "Task",
                calendarEntryId: id,
            };
        if (linked) {
            Object.assign(linked, record);
        } else state.tasks.push(record);
    }
    persistTasks();
    persistCalendar();
    state.year = Number(item.date.slice(0, 4));
    state.month = Number(item.date.slice(5, 7)) - 1;
    state.selectedCalendarDate = item.date;
    state.deadlineSubject = "All";
    state.agendaTab = kind;
    closeModal();
    renderApp();
    showToast(
        kind === "event"
            ? "Calendar event saved."
            : kind === "task"
                ? "Task added to Task Tracker."
                : "Deadline added to Upcoming Deadlines.",
    );
}
function schedule() {
    return scheduleBaseForSubjects();
}
function scheduleBaseForSubjects() {
    if (state.user?.plan !== "Duo")
        return locked(
            "Course planner",
            "Plan classes, tasks, deadlines, and study blocks in one flexible calendar. Upgrade to Duo to unlock the course planner.",
        );
    let first = new Date(state.year, state.month, 1),
        offset = (first.getDay() + 6) % 7,
        days = new Date(state.year, state.month + 1, 0).getDate(),
        chosen =
            state.selectedCalendarDate ||
            dayKey(
                new Date(state.year, state.month, Math.min(new Date().getDate(), days)),
            ),
        cells = Array.from({ length: 42 }, (_, i) => {
            let d = i - offset + 1;
            if (d < 1 || d > days) return '<div class="cal-cell"></div>';
            let key = dayKey(new Date(state.year, state.month, d)),
                events = calendarEvents.filter((x) => x.date === key),
                entries = state.tasks
                    .map((t, i) => ({ t, i }))
                    .filter((x) => x.t.calendarDate === key),
                eventHtml = events
                    .map(
                        (e) =>
                            `<span class="entry-chip calendar-event" style="--subject-color:${subjectColor(e.subject)};--event-color:${esc(e.color || "#d9bedf")}"><span class="chip-time">${eventTime(e)}</span><b>${esc(e.title)}</b><small>${esc(e.subject)}</small></span>`,
                    )
                    .join(""),
                entryHtml = entries
                    .map(
                        ({ t, i }) =>
                            `<span class="entry-chip ${t.kind === "deadline" ? "calendar-deadline" : "calendar-task"}" style="--subject-color:${subjectColor(t.course)}" title="${t.kind === "deadline" ? "Upcoming deadline" : "Task Tracker task"}">${t.startTime ? `<span class="chip-time">${esc(t.startTime)}–${esc(t.endTime || "")}</span>` : ""}<b>${esc(t.title)}</b><small>${esc(t.course)}${t.date ? ` · ${esc(t.date)}` : ""}</small></span>`,
                    )
                    .join("");
            return `<div class="cal-cell day-cell ${chosen === key ? "selected" : ""}" onclick="selectCalendarDay('${key}')"><b>${d}</b><div class="day-items">${eventHtml}${entryHtml}</div></div>`;
        }).join(""),
        allAgenda = state.agendaTab || "events",
        today = dayKey(new Date()),
        events = calendarEvents
            .filter((e) => e.date >= today)
            .sort((a, b) =>
                (a.date + a.startTime).localeCompare(b.date + b.startTime),
            ),
        tasks = state.tasks
            .map((t, i) => ({ t, i }))
            .filter((x) => x.t.kind === "task"),
        deadlines = state.tasks
            .map((t, i) => ({ t, i }))
            .filter((x) => x.t.kind === "deadline");
    return `<div class="calendar-toolbar"><button class="iconbtn" onclick="changeMonth(-1)">←</button><h3 style="margin:0">${new Date(state.year, state.month).toLocaleString("en", { month: "long", year: "numeric" })}</h3><div><button class="iconbtn" onclick="changeMonth(1)">→</button> <button class="btn small" onclick="addCalendarEvent('${chosen}')">＋ Add event</button></div></div><div class="subject-key-row">${subjectNames()
        .map(
            (s) =>
                `<span class="subject-key"><i style="--key-color:${subjectColor(s)}"></i>${esc(s)}</span>`,
        )
        .join(
            "",
        )}<button class="linkbutton" onclick="manageSubjects()">＋ Manage subjects & colors</button></div><div class="calendar-layout"><div class="card"><div class="calendar-grid">${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((x) => `<div class="cal-cell head">${x}</div>`).join("")}${cells}</div><p class="subtitle" style="margin-top:12px">Select a date to add a calendar event, task, or deadline. Selected: <b>${new Date(chosen + "T12:00:00").toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</b></p><button class="btn light small" onclick="addCalendarEvent('${chosen}')">＋ Add to selected date</button></div><aside class="card event-list calendar-agenda"><div class="eyebrow">PLANNER</div><h3 style="margin-top:8px">Agenda</h3><div class="agenda-tabs"><button class="${allAgenda === "events" ? "active" : ""}" onclick="state.agendaTab='events';renderApp()">Events · ${events.length}</button><button class="${allAgenda === "task" ? "active" : ""}" onclick="state.agendaTab='task';renderApp()">Tasks · ${tasks.length}</button><button class="${allAgenda === "deadline" ? "active" : ""}" onclick="state.agendaTab='deadline';renderApp()">Deadlines · ${deadlines.length}</button></div>${allAgenda === "events" ? events.map((e) => `<article class="agenda-event" style="--subject-color:${subjectColor(e.subject)};--event-color:${esc(e.color || "#d9bedf")}"><b>${esc(e.title)}</b><small>${new Date(e.date + "T12:00:00").toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })} · <span class="agenda-time">${eventTime(e)}</span></small><small>${esc(e.subject)}</small><button class="linkbutton" onclick="editCalendarEvent('${e.id}')">Edit</button> <button class="linkbutton" onclick="deleteCalendarEvent('${e.id}')">Delete</button></article>`).join("") || '<p class="subtitle">No upcoming events.</p>' : (allAgenda === "task" ? tasks : deadlines).map(({ t, i }) => `<div class="agenda-task ${state.completed.includes(i) ? "done" : ""}"><input type="checkbox" ${state.completed.includes(i) ? "checked" : ""} onchange="toggleTask(${i})"><span><b>${esc(t.title)}</b><small style="color:${subjectColor(t.course)}">${esc(t.course)} · ${esc(t.date)}</small></span><button class="linkbutton" onclick="editPlannerEntry(${i})">Edit</button><button class="deadline-delete" onclick="removeTask(${i})">×</button></div>`).join("") || `<p class="subtitle">No ${allAgenda === "task" ? "tasks" : "deadlines"} yet.</p>`}</aside></div>`;
}
function overview() {
    let all = state.tasks.map((task, i) => ({
            task,
            i,
            done: state.completed.includes(i),
        })),
        tasks = all.filter((x) => x.task.kind === "task"),
        deadlines = all
            .filter((x) => x.task.kind === "deadline")
            .sort((a, b) => Number(a.done) - Number(b.done)),
        filter = state.deadlineSubject || "All",
        visible = deadlines.filter(
            (x) =>
                filter === "All" ||
                x.task.course.toLowerCase() === filter.toLowerCase(),
        ),
        open = deadlines.filter((x) => !x.done).length,
        courses = subjectNames();
    return `<div class="action-row"><button class="btn" onclick="newNote()">＋ New note</button><button class="btn light" onclick="go('tools');scanPdf()">⇧ Scan PDF</button><button class="btn light" onclick="addTask()">＋ Add task</button><button class="btn light" onclick="go('library')">Open library</button></div><div class="stats"><div class="stat"><span>TASKS</span><b>${tasks.length}</b></div><div class="stat"><span>UPCOMING DEADLINES</span><b>${open}</b></div><div class="stat"><span>STUDY STREAK</span><b>${state.streak} <small style="font-size:12px">days</small></b></div></div><div class="dashboard-grid"><section class="card"><div class="card-head"><h3>Progress overview</h3><span class="eyebrow">Based on task completion</span></div>${courses
        .map((course) => {
            let rows = tasks.filter(
                    (x) => x.task.course.toLowerCase() === course.toLowerCase(),
                ),
                done = rows.filter((x) => x.done).length,
                pct = rows.length ? Math.round((done / rows.length) * 100) : 0;
            return `<div class="progress-row"><div class="progress-label"><b style="color:${subjectColor(course)}">${esc(course)}</b><span>${rows.length ? `${pct}% · ${done}/${rows.length} tasks` : "No linked tasks"}</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%;background:${subjectColor(course)}"></div></div></div>`;
        })
        .join(
            "",
        )}<button class="linkbutton" onclick="go('schedule')">Open course planner →</button></section><section class="card"><div class="card-head"><h3>Upcoming deadlines</h3><button class="linkbutton" onclick="go('schedule');state.agendaTab='deadline';renderApp()">View all</button></div><div class="subject-filter-row"><button class="subject-filter ${filter === "All" ? "active" : ""}" onclick="state.deadlineSubject='All';renderApp()">All subjects</button>${courses.map((c) => `<button class="subject-filter ${filter.toLowerCase() === c.toLowerCase() ? "active" : ""}" style="--subject-color:${subjectColor(c)}" onclick="state.deadlineSubject='${esc(c)}';renderApp()">${esc(c)}</button>`).join("")}</div>${visible.length ? visible.map(({ task: t, i, done }) => `<div class="week-item ${done ? "done" : ""}" onclick="toggleTask(${i})"><input type="checkbox" ${done ? "checked" : ""} aria-label="Mark ${esc(t.title)} ${done ? "incomplete" : "complete"}" onclick="event.stopPropagation()" onchange="toggleTask(${i})"><span><b class="deadline-title">${esc(t.title)}</b><small class="deadline-subject" style="--subject-color:${subjectColor(t.course)}">${esc(t.course)}</small></span><span class="due">${esc(done ? "Done" : t.date)}</span><button class="linkbutton" onclick="event.stopPropagation();editPlannerEntry(${i})">Edit</button><button class="deadline-delete" onclick="event.stopPropagation();removeTask(${i})">Delete</button></div>`).join("") : '<p class="subtitle">No upcoming deadlines for this subject.</p>'}</section></div><div class="bottom-grid"><section class="card timer-card"><div><span class="eyebrow" style="color:#e4cee5">FOCUS SESSION · POMODORO</span><h3>Ready for a deep dive?</h3><div class="timer-num" id="timer-num">${formatTime(state.timer)}</div></div><div class="timer-controls"><button onclick="toggleTimer()" id="timer-button">${state.timerRunning ? "Pause" : "Start focus"}</button><button onclick="resetTimer()">Reset</button><button onclick="go('tools')">Timer settings</button></div></section><section class="card"><div class="card-head"><h3>This week</h3><span class="eyebrow">Your momentum</span></div><ul class="activity-list"><li><span class="dot"></span>${tasks.filter((x) => !x.done).length} open tasks <span style="margin-left:auto;color:var(--muted)">This week</span></li><li><span class="dot" style="background:#91a48c"></span>${open} upcoming deadlines <span style="margin-left:auto;color:var(--muted)">This week</span></li></ul></section></div>`;
}
let renamedSubjects = JSON.parse(
        localStorage.getItem("idealibSubjectNames") || "{}",
    ),
    subjectColorOverrides = JSON.parse(
        localStorage.getItem("idealibSubjectColors") || "{}",
    );
function subjectNames() {
    return [
        ...new Set([
            ...baseSubjects.map((x) => renamedSubjects[x] || x),
            ...customSubjects.map((x) => x.name),
        ]),
    ];
}
function subjectColor(subject) {
    let name = String(subject || ""),
        override = subjectColorOverrides[name];
    if (override) return override;
    let custom = customSubjects.find(
        (x) => x.name.toLowerCase() === name.toLowerCase(),
    );
    if (custom?.color) return custom.color;
    let s = name.toLowerCase();
    if (s.includes("biology") || s.includes("bio")) return "#9166a0";
    if (s.includes("chem")) return "#4f8b78";
    if (s.includes("hist")) return "#bd765d";
    if (s.includes("math")) return "#5e7eae";
    return "#b08a45";
}
function notesLibrary() {
    let group = state.noteFolder || "all",
        selected = state.selectedNote,
        indices = notes
            .map((_, i) => i)
            .filter((i) => group === "all" || notes[i][0] === group),
        groups = subjectNames();
    return `<div class="page-content"><div class="subject-tabs"><button class="${group === "all" ? "active" : ""}" onclick="state.noteFolder='all';state.selectedNote=null;renderApp()">All notes · ${notes.length}</button>${groups.map((s) => `<button class="${group === s ? "active" : ""}" style="--subject-color:${subjectColor(s)}" onclick="state.noteFolder='${esc(s)}';state.selectedNote=null;renderApp()">${esc(s)} · ${notes.filter((n) => n[0] === s).length}</button>`).join("")}<button class="btn light small" onclick="manageSubjects()">Edit subjects & colors</button></div><div class="note-actions"><button class="btn small" onclick="newNote()">＋ New note</button><button class="btn light small" onclick="manageSubjects()">Manage subjects</button><button class="btn light small" onclick="createQuiz()">✦ Build review quiz from selected notes</button></div><div class="notes-grid" id="notes-grid">${indices.map((i) => `<article class="note-card" data-note="${i}" onclick="selectNote(${i})"><input type="checkbox" class="note-select" aria-label="Select ${esc(notes[i][1])}" onclick="event.stopPropagation()"><span class="tag" style="color:${subjectColor(notes[i][0])}">${esc(notes[i][0])}</span><h3>${esc(notes[i][1])}</h3><p>${esc(notes[i][2])}</p><button class="linkbutton" onclick="event.stopPropagation();selectNote(${i})">Open full note →</button></article>`).join("")}</div>${selected !== null && selected !== undefined ? noteDetail(selected) : ""}</div>`;
}
function noteDetail(i) {
    let n = notes[i];
    return `<div class="note-overlay" onclick="if(event.target===this){state.selectedNote=null;renderApp()}"><section class="note-detail" role="dialog" aria-modal="true" aria-label="${esc(n[1])}"><div class="detail-top"><span class="tag" style="color:${subjectColor(n[0])}">${esc(n[0])}</span><button class="iconbtn" onclick="state.selectedNote=null;renderApp()">Close ×</button></div><h2>${esc(n[1])}</h2><div class="subtitle">Complete study notes · Review guide</div><div class="note-body">${esc(fullNotes[i] || n[2])}</div><button class="btn small" onclick="createQuiz([${i}])">Create quiz from this note</button></section></div>`;
}
function editPlannerEntry(i) {
    let t = state.tasks[i];
    if (!t) return;
    let kind = t.kind === "deadline" ? "deadline" : "task";
    showModal(
        `<h2>Edit ${kind}</h2><p>Changes update the ${kind === "deadline" ? "Upcoming deadlines" : "Task Tracker"} and its calendar card.</p><form onsubmit="savePlannerEntry(event,${i})"><div class="field"><label>Title</label><input name="title" required value="${esc(t.title)}"></div><div class="field"><label>Subject</label><input name="course" list="edit-subject-list" required value="${esc(t.course)}">${subjectList("edit-subject-list")}<button type="button" class="linkbutton" onclick="manageSubjects()">＋ Manage subjects & colors</button></div><div class="field"><label>Due date</label><input name="date" type="date" value="${esc(t.calendarDate || "")}"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Start time (optional)</label><input name="startTime" type="time" value="${esc(t.startTime || "")}"></div><div class="field"><label>End time (optional)</label><input name="endTime" type="time" value="${esc(t.endTime || "")}"></div></div><button class="btn">Save changes</button></form>`,
    );
}
function savePlannerEntry(e, i) {
    e.preventDefault();
    let t = state.tasks[i];
    if (!t) return;
    let f = new FormData(e.target),
        date = f.get("date"),
        start = f.get("startTime"),
        end = f.get("endTime");
    if (start && end && end <= start) {
        showToast("End time must be later than start time.");
        return;
    }
    let course = String(f.get("course") || "").trim();
    if (!course) {
        showToast("Add a subject.");
        return;
    }
    rememberSubject(course);
    t.title = String(f.get("title") || "").trim();
    t.course = course;
    t.calendarDate = date || "";
    t.startTime = start || "";
    t.endTime = end || "";
    t.date = date
        ? new Date(date + "T12:00:00").toLocaleDateString("en", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    }) + (start ? ` · ${start}${end ? `–${end}` : ""}` : "")
        : "No due date";
    persistTasks();
    closeModal();
    renderApp();
    showToast("Changes saved.");
}
function tasksPage() {
    let list = state.tasks
        .map((t, i) => ({ t, i }))
        .filter((x) => (x.t.kind || "task") === "task");
    return `<div class="action-row"><button class="btn" onclick="addTask()">＋ Add task</button><button class="btn light small" onclick="manageSubjects()">Manage subjects</button><span class="eyebrow" style="align-self:center">${list.filter((x) => !state.completed.includes(x.i)).length} open tasks</span></div>${list.length ? `<div class="task-board">${list.map(({ t, i }) => `<article class="task-sticky ${state.completed.includes(i) ? "done" : ""}"><button class="remove-task" style="position:absolute;right:12px;top:8px" onclick="removeTask(${i})" aria-label="Remove task">×</button><label><input type="checkbox" ${state.completed.includes(i) ? "checked" : ""} onchange="toggleTask(${i})"> <span class="eyebrow" style="color:${subjectColor(t.course)}">${esc(t.course)}</span></label><h3>${esc(t.title)}</h3><p>Task · ${esc(t.date || "No due date")}</p><footer><span>${esc(t.course)}</span><span>${state.completed.includes(i) ? "Done ✓" : "To do"}</span></footer><button class="linkbutton" onclick="editPlannerEntry(${i})">Edit task</button></article>`).join("")}</div>` : '<section class="card" style="text-align:center;padding:46px"><h3>Your task list is clear</h3><p class="subtitle">Add a task here. Calendar deadlines stay in Upcoming Deadlines.</p><button class="btn" onclick="addTask()">＋ Add task</button></section>'}`;
}
render();