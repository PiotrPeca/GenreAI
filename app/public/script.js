// ============= NOTE HOVER ANIMATION =============

const noteIcon = document.getElementById('note-icon');

noteIcon.addEventListener('mouseover', () => {
    noteIcon.classList.add('fa-shake');
})

noteIcon.addEventListener('mouseout', () => {
    noteIcon.classList.remove('fa-shake');
})

// ============= UPLOAD TO BACKEND =============
const uploadForm = document.getElementById('upload-form');
const audioFileInput = document.getElementById('audio-file');
const resultDiv = document.getElementById('result');

uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

audioFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        uploadFile(file);
    }
});

function uploadFile(file) {
    const formData = new FormData();
    formData.append('audioFile', file);
    
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        resultDiv.textContent = `Genre: ${data.genre}`;
        resultDiv.style.display = 'block';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}