let selectedColor = null;

// Color name mapping (optional, for console / UI)
const colorNames = {
  "#ffec99": "Yellow",
  "#b2f2bb": "Green",
  "#a5d8ff": "Blue"
};

// DOM refs
const colorOptions   = document.querySelectorAll('.color-option');
const addNoteBtn     = document.getElementById('add-note-btn');
const searchInputEl  = document.getElementById('search-notes');
const notesContainer = document.getElementById('notes-container');
const noteTemplate   = document.getElementById('note-template');

// Utility: timestamp formatting
function formatTimestamp(date = new Date()) {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

// --- Setup color buttons (visuals already in CSS via data-color selectors) ---
colorOptions.forEach(option => {
  // ensure background shows even if CSS attribute selectors are absent
  option.style.backgroundColor = option.dataset.color;

  option.addEventListener('click', () => {
    // update state
    selectedColor = option.dataset.color;

    // toggle selected class (CSS uses .color-option.selected)
    colorOptions.forEach(btn => btn.classList.remove('selected'));
    option.classList.add('selected');

    // optional console / debug
    console.log('Color selected:', colorNames[selectedColor] || selectedColor);
  });
});

// --- Create / clone note from template ---
function createNoteElement(text, bgColor) {
  const clone = noteTemplate.content.cloneNode(true); // DocumentFragment
  const noteEl = clone.querySelector('.note');
  const contentEl = clone.querySelector('.note-content');
  const timestampEl = clone.querySelector('.timestamp');
  const deleteBtn = clone.querySelector('.delete-btn');

  // Apply content and styles
  contentEl.textContent = text;
  noteEl.style.backgroundColor = bgColor; // overrides template default

  // Timestamp
  timestampEl.textContent = formatTimestamp();

  // Delete handler (attached to this clone)
  deleteBtn.addEventListener('click', () => {
    // noteEl is inside fragment; when appended, this will remove the rendered note node
    // find the actual rendered node and remove it
    // deleteBtn.closest('.note') would work on the appended node; here we use parent traversal at runtime
    const renderedNote = deleteBtn.closest('.note');
    if (renderedNote) renderedNote.remove();
  });

  // Return the fragment for appending
  return clone;
}

addNoteBtn.addEventListener('click', () => {
  // Validate color
  if (!selectedColor) {
    console.log('No color selected! Please pick a color before adding a note.');
    // You can show inline UI feedback instead of console.log
    return;
  }

  // Validate text
  const textEntered = searchInputEl.value.trim();
  if (!textEntered) {
    console.log('No text entered! Please type your note text.');
    return;
  }

  // Build and append
  const frag = createNoteElement(textEntered, selectedColor);
  notesContainer.appendChild(frag);

  // Focus the newly added note's content so user can immediately edit
  // query the last .note in container (safer than relying on frag references)
  const notes = notesContainer.querySelectorAll('.note');
  const lastNote = notes[notes.length - 1];
  if (lastNote) {
    const content = lastNote.querySelector('.note-content');
    if (content) {
      content.focus();
      // optional: place caret at end
      document.execCommand('selectAll', false, null);
      document.getSelection().collapseToEnd();
    }
  }

  // Clear input and reset color selection (optional UX choice)
  searchInputEl.value = '';
  colorOptions.forEach(btn => btn.classList.remove('selected'));
  selectedColor = null;

  console.log('Note added with color:', colorNames[selectedColor] || selectedColor, 'and text:', textEntered);
});