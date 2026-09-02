import { useState } from 'react'
import Pagination from './Pagination/Pagination'

const BASE_URL = import.meta.env.VITE_LOCAL_IP
function App() {
    const [file, setFile] = useState(null);

    async function uploadFile() {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
            "http://192.168.1.5:8000/upload/",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        console.log(data);
    }

    return (
        <div>
            <h1>LAN File Share</h1>

            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button onClick={uploadFile}>
                Send
            </button>
        </div>
    );
}

export default App;
