# LAN File Share

A real-time file sharing application that allows devices connected to the same local network to discover each other and transfer files through WebSockets.

Built with **React**, **Django**, and **Django Channels**.

---

## ✨ Features

- 🔍 Discover devices connected to the same LAN
- 📱 Detect device type (Desktop / Mobile)
- 🔄 Real-time communication using WebSockets
- 📤 Send files to another connected device
- 📥 Receive files directly in the browser
- 🧩 Transfer files using chunks
- ✅ Chunk acknowledgement (ACK) system
- 📊 Real-time transfer progress
- 🆔 Unique transfer IDs
- ⚡ No cloud storage required
- 🌐 Works across devices on the same local network

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- WebSocket API
- HTML
- CSS

### Backend

- Python
- Django
- Django Channels
- ASGI

---

## 🏗️ Architecture

```text
┌──────────────────────┐
│     React Client     │
│       Sender         │
└──────────┬───────────┘
           │
           │ WebSocket
           ▼
┌────────────────────────────┐
│      Django Channels       │
│                            │
│  WebSocket Consumers       │
│  Channel Layer             │
│  Device Groups             │
└───────────┬────────────────┘
            │
            │ WebSocket
            ▼
┌──────────────────────┐
│     React Client     │
│      Receiver        │
└──────────────────────┘
````

---

## 📂 File Transfer Flow

Files are divided into smaller chunks before being transferred.

```text
Sender
  │
  │ File metadata
  ▼
Django Channels
  │
  │ file_offer
  ▼
Receiver
  │
  │ file_ready
  ▼
Sender
  │
  │ Chunk 0
  ▼
Receiver
  │
  │ ACK 0
  ▼
Sender
  │
  │ Chunk 1
  ▼
Receiver
  │
  │ ACK 1
  ▼
      ...
  │
  │ Final ACK
  ▼
Sender
  │
  │ transfer_complete
  ▼
Receiver
  │
  │ Reconstruct Blob
  ▼
Download File
```

---

## 🔄 Communication Flow

### 1. Device Discovery

When a client connects, it registers its:

* Device ID
* Device name
* Device type

The backend adds the device to a device-specific Channels group.

### 2. File Offer

The sender sends file metadata containing:

* File name
* File size
* Total number of chunks
* Transfer ID
* Target device

Django Channels forwards this information to the selected receiver.

### 3. Receiver Confirmation

The receiver responds with:

```text
file_ready
```

This tells the sender that the receiver is ready to receive the file.

### 4. Chunk Transfer

The sender divides the file into chunks.

Current chunk size:

```text
64 KB
```

Each chunk is sent as a binary WebSocket message.

### 5. Acknowledgement

After receiving a chunk, the receiver sends an acknowledgement:

```text
chunk_ack
```

The sender then sends the next chunk.

The transfer therefore follows:

```text
Send → ACK → Send → ACK → Send → ACK
```

### 6. Completion

After the final chunk is acknowledged, the sender sends:

```text
transfer_complete
```

The receiver combines all received chunks into a `Blob` and triggers a browser download.

---

## 🚀 Running the Project

### Prerequisites

Make sure you have:

* Python 3.x
* Node.js
* npm

Both devices must be connected to the **same local network**.

---

# Backend Setup

Navigate to the Django backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the server so other devices on the LAN can access it:

```bash
python manage.py runserver 0.0.0.0:8000
```

---

# Frontend Setup

Navigate to the React project:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev -- --host
```

Open the application using the development server's LAN address.

---

## ⚠️ Local Network Requirement

This application is designed for devices connected to the same LAN.

Example:

```text
Laptop
192.168.31.164
     │
     │ Local Network
     │
     ├────────────── Phone
     │              192.168.31.xxx
     │
     └────────────── Other Device
```

The Django backend must be accessible from the other devices on the network.

---

## 🔌 WebSocket Endpoint

During local development, the frontend connects to the Django Channels server using:

```text
ws://<SERVER_IP>:8000/ws/devices/
```

Example:

```text
ws://192.168.31.164:8000/ws/devices/
```

For production deployment, use a secure WebSocket connection:

```text
wss://your-domain.com/ws/devices/
```

---

## 📊 Transfer Progress

Transfer progress is calculated using the number of acknowledged chunks:

```text
Progress =
(completed chunks / total chunks) × 100
```

The progress therefore represents chunks that have been successfully acknowledged by the receiver.

---

## 🔐 Current Limitations

This is **Version 1** of the project.

Current limitations include:

* Designed primarily for local network usage
* No user authentication
* No transfer cancellation
* No pause/resume functionality
* No automatic WebSocket reconnection
* No persistent transfer history
* No advanced error recovery
* Files are temporarily held in browser memory during reconstruction
* Production deployment requires additional WebSocket and security configuration

---

## 🎯 Project Purpose

This project was built to learn and practically implement:

* WebSockets
* Django Channels
* ASGI
* Channel Layers
* Channels Groups
* React WebSocket integration
* Binary WebSocket communication
* File chunking
* ACK-based communication
* Real-time progress tracking

---

## 📚 What I Learned

Building this project provided practical experience with real-time client-server communication beyond traditional REST APIs.

The project demonstrates how:

```text
React
  ↓
WebSocket
  ↓
Django Channels
  ↓
Channel Layer
  ↓
Device Groups
  ↓
Another WebSocket Client
```

can be used to build real-time applications.

---

## 🔮 Future Improvements

Possible improvements for future versions:

* [ ] Drag & drop file sharing
* [ ] Multiple file transfers
* [ ] Transfer cancellation
* [ ] Pause / resume transfers
* [ ] Automatic WebSocket reconnection
* [ ] Better transfer error handling
* [ ] Transfer speed display
* [ ] Estimated time remaining
* [ ] File size formatting
* [ ] Multiple simultaneous transfers
* [ ] Authentication / secure device pairing
* [ ] Production deployment
* [ ] Better large-file memory handling

---

## 👨‍💻 Author

**Anup Kumar**

Built as a learning project to understand real-time communication using React and Django Channels.

---

## ⭐ Version

**LAN File Share — V1.0**

Core file transfer functionality is complete and working over a local network.

```
```
