const supabaseUrl = 'https://zitvsrsnckqyvjoiihqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppdHZzcnNuY2txeXZqb2lpaHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNzY4NjIsImV4cCI6MjA2MTY1Mjg2Mn0.03f8PJTmRfklVW7CepxcwBzHhVaR5BwQJ_s8TqyhOkU';





  
async function fetchNotes() {
    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/notes`, {
            headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`
            }
        });

        if (!res.ok) {
            throw new Error(`Error fetching notes: ${res.status}`);
        }

        const data = await res.json();
        const notesDiv = document.getElementById('notes');

        if (data.length === 0) {
            notesDiv.innerHTML = '<p class="text-muted">No notes yet. Add one!</p>';
        } else {
            notesDiv.innerHTML = data.map(note => `
                <div class="card mb-3" id="note-${note.id}">
                    <div class="card-body">
                        <h5 class="card-title">${note.title}</h5>
                        <p class="card-text">${note.content}</p>
                        <small class="text-muted">Created: ${new Date(note.created_at).toLocaleString()}</small>
                        <button class="btn btn-danger btn-sm mt-2" onclick="deleteNote('${note.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error(error);
        document.getElementById('notes').innerHTML = '<p style="color:red;">Failed to load notes.</p>';
    }
}





async function deleteNote(id) {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/notes?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`
            }
        });

        if (res.ok) {
            // Optimistic UI update: remove the note immediately from DOM
            const noteCard = document.getElementById(`note-${id}`);
            if (noteCard) noteCard.remove();

            // Optional: Check if any notes are left; if none, reload
            const remainingNotes = document.querySelectorAll('#notes .card');
            if (remainingNotes.length === 0) {
                fetchNotes();
            }
        } else {
            alert('Failed to delete note.');
        }
    } catch (error) {
        console.error(error);
        alert('Error deleting note.');
    }
}

document.getElementById('noteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    if (!title || !content) {
        alert('Both fields are required!');
        return;
    }

    try {
        const res = await fetch(`${supabaseUrl}/rest/v1/notes`, {
            method: 'POST',
            headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });

        if (!res.ok) {
            throw new Error(`Error adding note: ${res.status}`);
        }

        document.getElementById('noteForm').reset();
        fetchNotes();

    } catch (error) {
        console.error(error);
        alert('Failed to add note.');
    }
});

// Initial load
fetchNotes();
