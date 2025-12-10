import express from 'express'
import multer from 'multer'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pythonPath = path.join(__dirname, "classifier.py");
const pythonExecutable = path.join(__dirname, '../../.venv/Scripts/python.exe');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
})

app.post('/api/upload', upload.single('audioFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded', req.file);
    const pythonProcess = spawn(pythonExecutable, [pythonPath, req.file.path]);

    let dataFromPython = '';

    pythonProcess.stdout.on('data', (data) => {
        dataFromPython += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    })

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Python script failed' });
        }
        res.json({ genre: dataFromPython.trim() });
    })
})

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`);
})