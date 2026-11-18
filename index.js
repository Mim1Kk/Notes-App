const noteDialog = document.getElementById('noteDialog');
const titleInput = document.getElementById('noteTitleField');
const contentInput = document.getElementById('noteContent');
const noteForm = document.getElementById('noteForm');
const noteContainer = document.getElementById('notesContainer');


let notes = []
let editingNoteID = null




function saveNote(event){
    event.preventDefault()

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if(editingNoteID) {
        const noteIndex = notes.findIndex(note => note.id === editingNoteID)

        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content,
        }


    }

    else{
        notes.unshift({
            id: generateID(),
            title: title,
            content: content
        })        
    }



    saveNotes()
    renderNotes()
    closeNoteDialog()
}


function saveNotes() {
    return localStorage.setItem('quickNotes', JSON.stringify(notes))
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id != noteId)
    saveNotes()
    renderNotes()
}


function generateID(){
    return Date.now().toString()
}


function loadNotes() {
    const savedNotes = localStorage.getItem('quickNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
}


function renderNotes() {
    if(notes.length === 0){
        notesContainer.innerHTML = `
            <div class = "empty-state">
                <h2Pretty empty in here 🦆</h2>
                <p>Make a new note by clicking on this button</p>
                <button class= "add-note-btn" onclick="openNoteDialog()">Add a note!</button>
            </div>
        `
        return
    }

    notesContainer.innerHTML = notes.map(note => `
        <div class = "note-card"> 
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>
            <div class="note-card-actions">            
                <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">✏️</button>
                <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note">🗑️</button>
            </div>
        </div>
    `).join('')

}


function openNoteDialog(noteId = null) {
    
    if(noteId){
        const noteToEdit = notes.find(note => note.id === noteId)
        editingNoteID = noteId
        document.getElementById('dialogTitle').textContent = 'Edit Note'
        titleInput.value = noteToEdit.title
        contentInput.value = noteToEdit.content
    }

    else{
        editingNoteID = null
        document.getElementById('dialogTitle').textContent = 'New Note'
        titleInput.value = ''
        contentInput.value = ''
    }
    
    
    noteDialog.showModal()
    titleInput.focus()
}

function closeNoteDialog() {
    noteDialog.close()
}

document.addEventListener('DOMContentLoaded', function(){
    notes = loadNotes()
    renderNotes()
    
    noteForm.addEventListener('submit',saveNote)    

    noteDialog.addEventListener('click',function(event){
        if(event.target === this){
            closeNoteDialog()
        }
    })

})