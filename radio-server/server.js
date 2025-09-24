import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/aac',
      'audio/ogg',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// In-memory storage for radio state
let radioState = {
  isLive: false,
  currentTrack: null,
  playlist: [],
  listeners: 0,
  streamUrl: null,
  metadata: {
    title: 'Radio Comunitaria Pinto Los Pellines',
    artist: 'Comunidad Local',
    description: 'Estación de radio comunitaria de Pinto Los Pellines',
  },
};

// Audio file serving with proper headers
app.get('/stream', (req, res) => {
  const range = req.headers.range;

  if (!radioState.currentTrack) {
    return res.status(404).json({ error: 'No track currently playing' });
  }

  const filePath = path.join(
    __dirname,
    'uploads',
    radioState.currentTrack.filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Track file not found' });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  // Handle range requests for streaming
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416).send('Requested range not satisfiable');
      return;
    }

    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Range',
      'Access-Control-Expose-Headers': 'Content-Range',
    });

    file.pipe(res);
  } else {
    // Stream entire file
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });

    fs.createReadStream(filePath).pipe(res);
  }
});

// Get current radio status
app.get('/status', (req, res) => {
  res.json({
    ...radioState,
    listeners: io.engine.clientsCount,
  });
});

// Upload audio file
app.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const track = {
    id: Date.now().toString(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    title: req.body.title || req.file.originalname,
    artist: req.body.artist || 'Unknown Artist',
    duration: req.body.duration || 0,
    uploadedAt: new Date().toISOString(),
  };

  radioState.playlist.push(track);

  // Broadcast to all connected clients
  io.emit('track-added', track);

  res.json({
    success: true,
    track,
    message: 'Track uploaded successfully',
  });
});

// Start live broadcast
app.post('/live/start', (req, res) => {
  radioState.isLive = true;
  radioState.metadata = {
    ...radioState.metadata,
    ...req.body,
  };

  io.emit('live-started', radioState.metadata);

  res.json({
    success: true,
    message: 'Live broadcast started',
    metadata: radioState.metadata,
  });
});

// Stop live broadcast
app.post('/live/stop', (req, res) => {
  radioState.isLive = false;

  io.emit('live-stopped');

  res.json({
    success: true,
    message: 'Live broadcast stopped',
  });
});

// Set current track
app.post('/track/:id', (req, res) => {
  const trackId = req.params.id;
  const track = radioState.playlist.find(t => t.id === trackId);

  if (!track) {
    return res.status(404).json({ error: 'Track not found' });
  }

  radioState.currentTrack = track;
  radioState.metadata = {
    title: track.title,
    artist: track.artist,
    description: `Reproduciendo: ${track.title} - ${track.artist}`,
  };

  io.emit('track-changed', {
    track,
    metadata: radioState.metadata,
  });

  res.json({
    success: true,
    track,
    metadata: radioState.metadata,
  });
});

// Get playlist
app.get('/playlist', (req, res) => {
  res.json({
    playlist: radioState.playlist,
    currentTrack: radioState.currentTrack,
  });
});

// Delete track
app.delete('/track/:id', (req, res) => {
  const trackId = req.params.id;
  const trackIndex = radioState.playlist.findIndex(t => t.id === trackId);

  if (trackIndex === -1) {
    return res.status(404).json({ error: 'Track not found' });
  }

  const track = radioState.playlist[trackIndex];

  // Remove file from disk
  const filePath = path.join(__dirname, 'uploads', track.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from playlist
  radioState.playlist.splice(trackIndex, 1);

  // If this was the current track, clear it
  if (radioState.currentTrack?.id === trackId) {
    radioState.currentTrack = null;
  }

  io.emit('track-removed', trackId);

  res.json({
    success: true,
    message: 'Track deleted successfully',
  });
});

// Socket.IO connection handling
io.on('connection', socket => {
  console.log('Client connected:', socket.id);

  // Send current status to new client
  socket.emit('status', {
    ...radioState,
    listeners: io.engine.clientsCount,
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('request-status', () => {
    socket.emit('status', {
      ...radioState,
      listeners: io.engine.clientsCount,
    });
  });
});

// Auto-play next track when current ends (basic implementation)
let autoPlayInterval;

const startAutoPlay = () => {
  if (autoPlayInterval) clearInterval(autoPlayInterval);

  autoPlayInterval = setInterval(() => {
    if (
      !radioState.isLive &&
      radioState.playlist.length > 0 &&
      radioState.currentTrack
    ) {
      const currentIndex = radioState.playlist.findIndex(
        t => t.id === radioState.currentTrack.id
      );
      const nextIndex = (currentIndex + 1) % radioState.playlist.length;
      const nextTrack = radioState.playlist[nextIndex];

      radioState.currentTrack = nextTrack;
      radioState.metadata = {
        title: nextTrack.title,
        artist: nextTrack.artist,
        description: `Reproduciendo: ${nextTrack.title} - ${nextTrack.artist}`,
      };

      io.emit('track-changed', {
        track: nextTrack,
        metadata: radioState.metadata,
      });
    }
  }, 30000); // Change track every 30 seconds for demo (should be based on actual duration)
};

// Start auto-play
startAutoPlay();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    listeners: io.engine.clientsCount,
    isLive: radioState.isLive,
    currentTrack: radioState.currentTrack,
    playlistLength: radioState.playlist.length,
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: error.message || 'Internal server error',
  });
});

// Start server
server.listen(PORT, () => {
  console.log(
    `🎵 Radio Comunitaria Pinto Los Pellines Server running on port ${PORT}`
  );
  console.log(`📡 Stream URL: http://localhost:${PORT}/stream`);
  console.log(`🌐 Web interface: http://localhost:${PORT}`);
  console.log(`📊 Status endpoint: http://localhost:${PORT}/status`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down radio server...');
  if (autoPlayInterval) clearInterval(autoPlayInterval);
  server.close(() => {
    console.log('✅ Radio server stopped');
    process.exit(0);
  });
});
