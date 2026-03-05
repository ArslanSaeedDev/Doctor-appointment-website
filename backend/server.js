import 'dotenv/config'; // Load .env first
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDb from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
import chatRouter from './routes/chatRoute.js';
import { setupSocketHandlers } from './socket/socketHandler.js';

// App config
const app = express();
const port = process.env.PORT || 8000;

// Create HTTP server wrapping Express
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.ADMIN_URL || "http://localhost:5174",
    ],
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to database
connectDb();
connectCloudinary();

//api Endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use('/api/chat',chatRouter)

// Test endpoint
app.get("/", (req, res) => {
  res.send("API is working");
});

// Setup socket event handlers
setupSocketHandlers(io);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
