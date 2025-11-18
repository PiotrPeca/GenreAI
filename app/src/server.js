import express from 'express'
import multer from 'multer'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/api/upload', upload.single('audioFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File uploaded', req.file);
    res.json({ genre: 'Rock' });
})

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`);
})