/* =============== SAMPLE TASKS ================== */
let tasks = [
  { id: 1, title: "Sample Task 1", date: "2025-11-16", color: "#ffec99" },
  { id: 2, title: "Sample Task 2", date: "2025-11-17", color: "#b2f2bb" },
  { id: 3, title: "Sample Task 3", date: "2025-11-18", color: "#a5d8ff" }
];

/* =============== DOM ELEMENTS ================== */
const groupsContainer = document.getElementById("groups-container");
const addTaskBtn = document.getElementById("add-task-btn");
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const colorOptions = document.querySelectorAll(".color-option");

let selectedColor = null;

/* =============== SELECT COLOR ================== */
colorOptions.forEach((option) => {
  option.style.backgroundColor = option.dataset.color;

  option.addEventListener("click", () => {
    colorOptions.forEach(btn => btn.classList.remove("selected"));
    option.classList.add("selected");
    selectedColor = option.dataset.color;
  });
});

/* =============== DATE GROUP HELPERS ================== */
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function getBucketForDate(dateStr) {
  if (!dateStr) return "No date";

  const today = startOfDay(new Date());
  const t = startOfDay(new Date(dateStr + "T00:00:00"));

  const diffDays = Math.round((t - today) / (1000 * 60 * 60 * 24));

  if (diffDays === -1) return "Yesterday";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays >= 2 && diffDays <= 7) return "Next week";
  if (diffDays < -1) return "Earlier";
  return "Later";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* =============== GROUPING LOGIC ================== */
function groupTasks(tasks) {
  const map = new Map();

  for (const t of tasks) {
    const bucket = getBucketForDate(t.date);
    if (!map.has(bucket)) map.set(bucket, []);
    map.get(bucket).push(t);
  }

  const order = ["Yesterday", "Today", "Tomorrow", "Next week", "Later", "Earlier", "No date"];
  return order.filter(k => map.has(k)).map(k => ({ key: k, items: map.get(k) }));
}

/* =============== RENDER UI ================== */
function render() {
  groupsContainer.innerHTML = "";
  const grouped = groupTasks(tasks);

  grouped.forEach(group => {
    const section = document.createElement("section");
    section.className = "group";

    // HEADER
    const header = document.createElement("div");
    header.className = "group-header";

    const left = document.createElement("div");
    left.innerHTML = `<div class="group-title">${group.key}</div>
                      <div class="muted">${group.items.length} item(s)</div>`;

    const toggle = document.createElement("button");
    toggle.className = "toggle-btn";
    toggle.innerHTML = `<span class="chev">▾</span>`;
    toggle.setAttribute("aria-expanded", "true");

    toggle.addEventListener("click", () => {
      const body = section.querySelector(".group-body");
      const expanded = toggle.getAttribute("aria-expanded") === "true";

      toggle.setAttribute("aria-expanded", !expanded);
      body.classList.toggle("collapsed");
      toggle.querySelector(".chev").style.transform = expanded ? "rotate(-90deg)" : "rotate(0deg)";
    });

    header.appendChild(left);
    header.appendChild(toggle);

    // BODY
    const body = document.createElement("div");
    body.className = "group-body";

    const ul = document.createElement("ul");
    ul.className = "task-list";

    group.items.forEach(t => {
      const li = document.createElement("li");
      li.className = "task-item";
      li.style.backgroundColor = t.color || "#fff";

      li.innerHTML = `
        <span class="task-text">${t.title}</span>
        <span class="task-date">${formatDate(t.date)}</span>
      `;

      li.addEventListener("click", () => li.classList.toggle("completed"));
      ul.appendChild(li);
    });

    body.appendChild(ul);
    section.appendChild(header);
    section.appendChild(body);
    groupsContainer.appendChild(section);
  });
}

/* =============== ADD NEW TASK ================== */
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (!text) return alert("Enter a task!");

  tasks.push({
    id: Date.now(),
    title: text,
    date: date || null,
    color: selectedColor || "#fff"
  });

  taskInput.value = "";
  taskDate.value = "";
  selectedColor = null;
  colorOptions.forEach(btn => btn.classList.remove("selected"));

  render();
});

/* =============== INITIAL RENDER ================== */
render();