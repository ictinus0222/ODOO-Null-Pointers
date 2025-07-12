import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8000;

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve test-connection.html
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'test-connection.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running at http://localhost:${PORT}`);
    console.log(`Test page available at http://localhost:${PORT}/test`);
}); 