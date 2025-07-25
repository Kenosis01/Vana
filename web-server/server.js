const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const socketIo = require('socket.io');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vana web server is running' });
});

// Mock API for code generation
app.post('/api/generate', (req, res) => {
  const { prompt } = req.body;
  
  // In a real implementation, this would communicate with the VSCode extension
  // For now, we'll just return a mock response
  setTimeout(() => {
    res.json({
      success: true,
      message: 'Code generated successfully',
      files: [
        {
          name: 'index.html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated from: ${prompt}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello from Vana!</h1>
  <p>This is a sample page generated from your prompt: "${prompt}"</p>
  <script src="script.js"></script>
</body>
</html>`
        },
        {
          name: 'styles.css',
          content: `body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #1A2B20;
}`
        },
        {
          name: 'script.js',
          content: `document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded!');
});`
        }
      ]
    });
  }, 2000); // Simulate processing time
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('prompt', (data) => {
    console.log('Received prompt:', data);
    
    // Emit a 'generating' event to show progress
    socket.emit('generating', { status: 'started' });
    
    // Simulate the generation process with progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      socket.emit('generating', { status: 'in-progress', progress });
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Send the completed result
        socket.emit('result', {
          success: true,
          message: 'Code generated successfully',
          files: [
            {
              name: 'index.html',
              content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated from: ${data.prompt}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello from Vana!</h1>
  <p>This is a sample page generated from your prompt: "${data.prompt}"</p>
  <script src="script.js"></script>
</body>
</html>`
            },
            {
              name: 'styles.css',
              content: `body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #1A2B20;
}`
            },
            {
              name: 'script.js',
              content: `document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded!');
});`
            }
          ]
        });
      }
    }, 500);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Catch-all handler to serve the React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});