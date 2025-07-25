# Vana Web Server

A web server for the Vana extension that provides a browser-based interface for users to interact with the AI coding assistant.

## Features

- Beautiful forest-themed UI with smooth animations
- Two-pane workspace with chat interface and code/preview panels
- Real-time code generation with Socket.IO
- Responsive design for all screen sizes

## Project Structure

- `server.js` - Express server with Socket.IO for real-time communication
- `client/` - React frontend with TypeScript and Tailwind CSS
  - `src/components/` - React components
    - `HomePage.tsx` - Initial view with prompt input
    - `WorkspacePage.tsx` - Two-pane workspace view
    - `ChatPanel.tsx` - Chat interface for interacting with the AI
    - `CodePreviewPanel.tsx` - Code editor and preview panel

## Installation

1. Install server dependencies:

```bash
cd Vana/web-server
npm install
```

2. Install client dependencies:

```bash
cd client
npm install
```

## Running the Server

1. Start the server and client concurrently:

```bash
cd Vana/web-server
npm run dev-all
```

This will start the Express server on port 5000 and the React client on port 3000.

2. Open your browser and navigate to:

```
http://localhost:3000
```

## Development

- Server runs on port 5000
- Client runs on port 3000
- Socket.IO is used for real-time communication
- The client proxies API requests to the server

## Forest Theme Colors

- Dark Forest Green (Top Gradient): `#1A2B20`
- Moss Green (Bottom Gradient): `#3B3D2D`
- Input Background: `#223528`
- Button Background: `#4E5A48`
- Primary Text: `#F0F2EF`
- Secondary Text: `#A0A8A2`
- Placeholder Text: `#788A7F`
- Accent: `#6A826D`
- Code Panel: `#1F3025`