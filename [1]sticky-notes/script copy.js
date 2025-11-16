// DOM Elements
const notesContainer = document.getElementById('notes-container');
const addNoteBtn = document.getElementById('add-note-btn');
const noteTemplate = document.getElementById('note-template');
const colorOptions = document.querySelectorAll('.color-option');

// Notes array to store our notes data
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Initialize the app
function init() {
    // Add event listeners
    
    colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all options
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        // Add selected class to clicked option
        option.classList.add('selected');
    });
});

// Set default selected color
colorOptions[0].classList.add('selected'); // Select first color by default
    
    addNoteBtn.addEventListener('click', addNote);
    


    // Load saved notes
    renderNotes();
}

// Create a new note element
function createNoteElement(note) {
    const noteElement = noteTemplate.content.cloneNode(true).children[0];
    const noteContent = noteElement.querySelector('.note-content');
    const deleteBtn = noteElement.querySelector('.delete-btn');
    const timestamp = noteElement.querySelector('.timestamp');

    // Set note content and color
    noteContent.textContent = note.content;
    noteElement.style.backgroundColor = note.color;
    
    // Format the timestamp
    timestamp.textContent = new Date(note.timestamp).toLocaleString();

    // Add event listeners
    deleteBtn.addEventListener('click', () => deleteNote(note.id));
    
    // Update note content when edited
    noteContent.addEventListener('input', () => {
        updateNote(note.id, { content: noteContent.textContent });
    });

    return noteElement;
}

// Add a new note
function addNote() {
    const searchInput   = document.getElementById('search-notes');
    const selectedColor = document.querySelector('.color-option.selected')?.dataset.color || '#ffec99';
    
    const newNote = {
        id: Date.now().toString(),
        content: searchInput.value.trim() || 'Click to edit...', 
        color: selectedColor,
        timestamp: new Date().toISOString()
    };

    searchInput.value = '';
    
    notes.push(newNote);
    saveNotes();
    renderNotes();
}

// Delete a note
function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    renderNotes();
}

// Update a note's properties
function updateNote(noteId, updates) {
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex > -1) {
        notes[noteIndex] = { ...notes[noteIndex], ...updates };
        saveNotes();
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Render all notes
function renderNotes() {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesContainer.appendChild(noteElement);
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);