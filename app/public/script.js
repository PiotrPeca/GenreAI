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
const uploadContent = document.getElementById('upload-content');
const loader = document.getElementById('loader-animation');
const resultDiv = document.getElementById('result');

uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
});

audioFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];

    uploadContent.style.display = 'none';
    loader.style.display = 'block';

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
        loader.style.display = 'none';
        uploadContent.style.display = 'flex';
        resultDiv.textContent = `Genre: ${data.genre}`;
        resultDiv.style.display = 'flex';
    })
    .catch(error => {
        loader.style.display = 'none';
        uploadContent.style.display = 'flex';
        console.error('Error:', error);
    });
}