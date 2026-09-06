import { useState, useEffect, useRef } from 'react'

import "./App.css"
import NavBar from './components/NavBar';
import DeviceName from './components/DeviceName';
import DeviceList from './components/DeviceList';



const CHUNK_SIZE = 64 * 1024;
function App() {
  const [allDevices, setAllDevices] = useState(null)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [incomingFile, setIncomingFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [showDevices, setShowDevices] = useState(false)

  const socketRef = useRef(null)
  const transferIdRef = useRef(null)
  const currentChunkRef = useRef(0);
  const selectedFileRef = useRef(null)
  const totalChunksRef = useRef(0);
  const incomingChunksRef = useRef([]);
  const incomingTransferRef = useRef(null);
  const incomingFileRef = useRef(null);

  const WS_URL = import.meta.env.VITE_WS_URL
  useEffect(() => {
    // checking device type 
    const device = navigator.userAgent
    let device_type;
    if (/Android|iPhone|iPad|iPod/i.test(device)) {
      device_type = "Mobile";
    } else {
      device_type = "Desktop";
    }

    socketRef.current = new WebSocket(
      `ws://${WS_URL}/ws/devices/`
    );

    socketRef.current.onopen = () => {

      // get device_id, if not then create one 
      let device_id = localStorage.getItem("device_id")
      if (!device_id) {
        device_id = Date.now().toString() + "-" + Math.random().toString(36).slice(2);
        localStorage.setItem("device_id", device_id)
      }
      const deviceName = localStorage.getItem("device_name")
      if (!deviceName){
        deviceName = "Unknown Device"
      }
      socketRef.current.send(JSON.stringify({
        device_id,
        device_name: deviceName,
        device_type
      }))

      socketRef.current.send(JSON.stringify({
        action: "get_devices"
      }))
    };

    socketRef.current.onmessage = (event) => {
      if (typeof event.data === "string") {

        const data = JSON.parse(event.data)

        if (data.devices) {
          setAllDevices(data.devices)
        }

        if (data.type == "file_offer") {
          alert("Someone wants to send you a file")

          const fileInfo = {
            transfer_id: data.transfer_id,
            file_name: data.file_name,
            file_size: data.file_size,
            total_chunks: data.total_chunks,
            sender_channel: data.sender_channel
          }

          // Store file information
          setIncomingFile(fileInfo)
          incomingFileRef.current = fileInfo

          // Clear chunks from any previous transfer
          incomingChunksRef.current = []

          // Store information about the current incoming transfer
          incomingTransferRef.current = {
            transferId: data.transfer_id,
            totalChunks: data.total_chunks,
            senderChannel: data.sender_channel
          }

          // Tell sender that we are ready
          socketRef.current.send(JSON.stringify({
            action: "file_ready",
            transfer_id: data.transfer_id,
            sender_channel: data.sender_channel
          }))
        }     //if block ends here

        if (data.type === "file_ready") {
          currentChunkRef.current = 0
          sendNextChunk()
        }

        if (data.type === "chunk_ack") {

          // Calculate progress from acknowledged chunks
          const completedChunks = data.chunk_index + 1
          const progress = Math.round(
            (completedChunks / totalChunksRef.current) * 100
          )

          setProgress(progress)

          if (data.chunk_index === totalChunksRef.current - 1) {

            socketRef.current.send(JSON.stringify({
              action: "transfer_complete",
              transfer_id: transferIdRef.current
            }))

            return
          }

          currentChunkRef.current++
          sendNextChunk()
        }

        if (data.type === "transfer_complete") {

          // Combine all received chunks into one file
          const blob = new Blob(incomingChunksRef.current)

          // Create a temporary URL for the file
          const url = URL.createObjectURL(blob)

          // Create an invisible download link
          const a = document.createElement("a")
          a.href = url
          a.download = incomingFileRef.current.file_name

          // Trigger the download
          a.click()

          // Remove the temporary URL
          URL.revokeObjectURL(url)
        }

      } else {

        // Store the received binary chunk
        incomingChunksRef.current.push(event.data)

        // Index of the chunk we just received
        const chunkIndex = incomingChunksRef.current.length - 1

        // Tell Django that this chunk was received
        socketRef.current.send(JSON.stringify({
          action: "chunk_ack",
          transfer_id: incomingTransferRef.current.transferId,
          chunk_index: chunkIndex,
          sender_channel: incomingTransferRef.current.senderChannel
        }))
      }

    }

    return () => {
      socketRef.current.close();
    };

  }, []);


  function sendFile() {

    if (!selectedDevice) {
      alert("Select a device first")
    }

    if (!selectedFile) {
      alert("Select a file")
    }

    if (selectedDevice && selectedFile) {
      setProgress(0)
      const transferId = Date.now().toString() + "-" + Math.random().toString(36).slice(2);
      transferIdRef.current = transferId
      const totalChunks = Math.ceil(selectedFile.size / CHUNK_SIZE);
      totalChunksRef.current = totalChunks;

      socketRef.current.send(JSON.stringify({
        action: "send_file",
        target_device: selectedDevice,
        transfer_id: transferId,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        total_chunks: totalChunks
      }))
    }
    setIsSending(true)
  }

  function sendNextChunk() {
    const currentChunk = currentChunkRef.current
    const start = currentChunk * CHUNK_SIZE

    const end = Math.min(start + CHUNK_SIZE, selectedFileRef.current.size)

    const chunk = selectedFileRef.current.slice(start, end)
    socketRef.current.send(chunk)
  }

  function showDeviceList(){
    setShowDevices(true)
  }

  function setFile(file){
    setSelectedFile(file)
    selectedFileRef.current = file
  }

  function setDevice(value){
    setSelectedDevice(value)
  }
  return (
    <>
    <main className='main fbHome'>
      <NavBar />
      <section className="body fbHome">
        <DeviceName showDevice={showDeviceList}/>
        {
          showDevices && 
          <DeviceList 
          setFile={setFile} 
          sendFile={sendFile} 
          devices={allDevices} 
          setDevice={setDevice}
          progress={progress}/>
        }
      </section>
    </main>

    </>
  );

  return (
    <div>
      <h1>LAN File Share</h1>

      <input
        type="file"
        onChange={(e) => {
          setSelectedFile(e.target.files[0])
          selectedFileRef.current = e.target.files[0]
        }}
      />

      <button onClick={sendFile}>
        Send
      </button>

      {
        allDevices ? (
          allDevices.map(device => {
            return (
              <h4 onClick={() => setSelectedDevice(device.device_id)}>{device.device_name} | {device.device_type}</h4>
            )
          })
        ) : (<h4>Waiting for the message</h4>)
      }
      
    </div>
  );
}

export default App;
