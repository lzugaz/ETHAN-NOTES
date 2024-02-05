document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createNote').addEventListener('click', createNewNote);
    document.getElementById('saveNote').addEventListener('click', saveCurrentNote);
    document.getElementById('deleteNote').addEventListener('click', deleteCurrentNote); // Add this line
    displayNotesList();
});

let currentNoteId = null;
function saveCurrentNote() {
    if (currentNoteId !== null) {
        const notes = getNotes();
        const noteIndex = notes.findIndex(note => note.id === currentNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex].name = document.getElementById('noteName').value;
            notes[noteIndex].content = document.getElementById('noteContent').value;
            saveNotes(notes);
            displayNotesList();
        }
    }
}

function getNotes() {
    return JSON.parse(localStorage.getItem('notes') || '[]');
}

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNewNote() {
    const notes = getNotes();
    const newNote = { id: Date.now(), name: 'New Note', content: '' };
    notes.push(newNote);
    saveNotes(notes);
    displayNotesList();
    selectNote(newNote.id);
}

function deleteNote(noteId) {
    let notes = getNotes();
    notes = notes.filter(note => note.id !== noteId);
    saveNotes(notes);
    displayNotesList();
}

function selectNote(noteId) {
    const notes = getNotes();
    const note = notes.find(note => note.id === noteId);
    if (note) {
        currentNoteId = note.id;
        document.getElementById('noteName').value = note.name;
        document.getElementById('noteContent').value = note.content;
        document.getElementById('noteName').oninput = (e) => updateNote(note.id, 'name', e.target.value);
        document.getElementById('noteContent').oninput = (e) => updateNote(note.id, 'content', e.target.value);
    }
}

function updateNote(noteId, field, value) {
    const notes = getNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
        notes[noteIndex][field] = value;
        saveNotes(notes);
    }
}

function displayNotesList() {
    const notes = getNotes();
    const noteList = document.getElementById('noteList');
    noteList.innerHTML = '';
    notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note.name;
        li.onclick = () => selectNote(note.id);
        noteList.appendChild(li);
    });

}

function deleteCurrentNote() {
    if (currentNoteId !== null && confirm('Are you sure you want to delete this note?')) {
        const notes = getNotes();
        const newNotes = notes.filter(note => note.id !== currentNoteId);
        saveNotes(newNotes);
        currentNoteId = null; // Reset the currentNoteId since the note is deleted
        displayNotesList();
        clearNoteDisplay(); // Add a function to clear the note display area
    }
}

function clearNoteDisplay() {
    document.getElementById('noteName').value = '';
    document.getElementById('noteContent').value = '';
}
