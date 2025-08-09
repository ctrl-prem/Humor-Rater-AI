// app.js
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';

// --- Create Express App ---
const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) to allow your frontend to make requests.
app.use(cors());

// Enable the server to parse JSON formatted request bodies.
app.use(express.json());

// --- API Routes ---
// A simple root route to confirm the server is up.
app.get('/', (req, res) => {
  res.send('Humor Rater AI Server is alive and well!');
});

// Mount the chat-related routes under the '/api/chat' path.
app.use('/api/chat', chatRoutes);


export default app;
