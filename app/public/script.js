// ============= NOTE HOVER ANIMATION =============
const noteIcon = document.querySelector('#note-icon');

noteIcon.addEventListener('mouseover', () => {
    noteIcon.classList.add('fa-shake');
})

noteIcon.addEventListener('mouseout', () => {
    noteIcon.classList.remove('fa-shake');
})

// ============= DRAG AND DROP =============
const dropArea = document.querySelector("#drop-area");
const inputFile = document.querySelector("#input-file");
const folderIcon = document.querySelector("#folder-icon");
const loader = document.querySelector("#loader-animation");
const genreResult = document.querySelector("#result");

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragging');
    folderIcon.classList.replace('fa-folder', 'fa-folder-open');
});

dropArea.addEventListener('dragleave', (e) => {
    dropArea.classList.remove('dragging');
    folderIcon.classList.replace('fa-folder-open', 'fa-folder');
});

dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragging');
    folderIcon.classList.replace('fa-folder-open', 'fa-folder');
    const file = e.dataTransfer.files[0];
    uploadFile(file);
})

dropArea.addEventListener('mouseover', () => {
    dropArea.classList.add('dragging');
    folderIcon.classList.replace('fa-folder', 'fa-folder-open');
})

dropArea.addEventListener('mouseout', () => {
    dropArea.classList.remove('dragging');
    folderIcon.classList.replace('fa-folder-open', 'fa-folder');
})

inputFile.addEventListener('change', () => {
    const file = inputFile.files[0];

    uploadFile(file);
});

function uploadFile(file) {
    dropArea.style.display = 'none';
    loader.style.display = 'block';
    genreResult.style.display = 'none';

    const formData = new FormData();
    formData.append("audioFile", file);
    
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        loader.style.display = 'none';
        dropArea.style.display = 'flex';
        genreResult.style.display = 'flex';
        genreResult.textContent = `Genre: ${data.genre}`;
    })
    .catch(error => {
        loader.style.display = 'none';
        dropArea.style.display = 'flex';
        genreResult.style.display = 'flex';
        genreResult.textContent = "Sorry, an error occured!";
        console.error('Error:', error);
    });
}