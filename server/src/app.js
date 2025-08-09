// app.js
import express from 'express';
import cors from 'cors';
import chatRoutes from './routes/chatRoutes.js';

// --- Create Express App ---
const app = express();

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (CORS) to allow your frontend to make requests.
const allowedOrigins = [
  "https://humor-rater-ai.vercel.app", 
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true  // for case, If cookies/auth headers are needed
}));

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
