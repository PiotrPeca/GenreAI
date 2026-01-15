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
const mainGenre = document.querySelector("#main-genre");
const detailsList = document.querySelector('#details-list');

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

    playPreview(file);
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

    playPreview(file);
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

        const mainResult = data.result[0].genre;
        mainGenre.textContent = `Predicted Genre: ${mainResult}`;

        const list = data.result
            .map(item => `${item.genre} - ${(item.probability * 100).toFixed(1)}%`)
            .join("<br>");
        
        detailsList.innerHTML = list;

        detailsHeader.style.display = 'block';
    })
    .catch(error => {
        loader.style.display = 'none';
        dropArea.style.display = 'flex';
        genreResult.style.display = 'flex';

        mainGenre.textContent = "Sorry, an error occured!";

        detailsHeader.style.display = 'none';
        detailsList.classList.remove('open');
        detailsList.innerHTML = '';

        console.error('Error:', error);
    });
}

// ============= RESULT BOX =============
const detailsHeader = document.querySelector('#details-header');
const chevronIcon = document.querySelector('#details-header i');

detailsHeader.addEventListener('click', () => {
    detailsList.classList.toggle('open');
    
    if (detailsList.classList.contains('open')) {
        chevronIcon.classList.replace('fa-caret-right', 'fa-caret-down');
    } else {
        chevronIcon.classList.replace('fa-caret-down', 'fa-caret-right');
    }
});

// ============= AUDIO PLAYER =============
const audioPlayer = document.querySelector("#audio-player");

function playPreview(file) {
    const url = URL.createObjectURL(file);
    audioPlayer.src = url;
    audioPlayer.style.display = 'block';
    audioPlayer.play();
}