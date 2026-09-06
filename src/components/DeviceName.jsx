import "../styles/Devicename.css"
import hero from "../assets/heroIMG.png"
import { useState, useContext, } from "react"

export default function DeviceName({ showDevice }) {
    const [deviceName, setDeviceName] = useState(() => localStorage.getItem("device_name") || "")
    const [isClosing, setIsClosing] = useState(false)

    function closeWindow() {
        if (deviceName) {
            localStorage.setItem("device_name", deviceName)
        }
        setTimeout(() => {
            setIsClosing(true)
            showDevice()
        }, 300);
    }

    return (
        <div className={`userName fbDev ${isClosing ? "closeUserName" : ""}`}>
            <img src={hero} alt="" />
            <p className="welcomeText">Welcome to LAN File Share</p>
            <p className="welcomeDesc">Choose a name to make this device discoverable on your network</p>
            <div className="nameInputBox fbDev">
                <p className="label">Make this device discoverable as</p>
                <input
                    type="text"
                    className="nameInput"
                    onChange={e => setDeviceName(e.target.value)}
                    value={deviceName}
                />
            </div>
            <button
                className="continueBTN"
                onClick={() => closeWindow()}
            >
                Continue
            </button>
        </div>
    )
}