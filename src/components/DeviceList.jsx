import "../styles/Devicelist.css"
import Progress from "./Progress"
import { useEffect, useState } from "react"
import { Wifi, Smartphone, TvMinimal } from "lucide-react"

export default function DeviceList({ setFile, sendFile, devices, setDevice, progress }) {
    const [deviceList, setDeviceList] = useState(devices || null)
    const [deviceSelected, setDeviceSelected] = useState(null)
    const [isFileSelected, setIsFileSelected] = useState(false)
    const [isSending, setIsSending] = useState(false)


    const device_id = localStorage.getItem("device_id")

    let avl = []
    useEffect(() => {
        if (avl.length == 0) {
            devices.map(item => {
                if (item.device_id != device_id) {
                    avl.push(item)
                }
            })
            setDeviceList(avl)
        }
    }, [devices])


    function setFileInfo(e) {
        setFile(e.target.files[0])
        setIsFileSelected(true)
    }
    function setDeviceInfo(e) {
        setDeviceSelected(e.device_name)
        setDevice(e.device_id)
    }

    function send() {
        sendFile()
        if (isFileSelected && deviceSelected) {
            setIsSending(true)
        }
    }
    return (
        <main className="sharingWindow fbDL">
            <p className="sharingWindowTitle">LAN File Share</p>
            <div className="fileinputBox fbDL">
                <input
                    type="file"
                    className="fileInput fbDL"
                    onChange={(e) => setFileInfo(e)}
                />
            </div>
            
            <div className="deviceList fbDL">
                {
                    deviceList.length != 0 ? (
                        deviceList.map(device => {
                            if (device.device_type === "Desktop" && device.device_id != device_id) {
                                return (
                                    <div className={`device fbDL ${deviceSelected == device.device_name ? "selected" : ""}`} onClick={() => setDeviceInfo(device)} >
                                        <TvMinimal className="deviceIcon" />
                                        <p className="devicelabel">{device.device_name}</p>
                                    </div>
                                )
                            }
                            if (device.device_type === "Mobile" && device.device_id != device_id) {
                                return (
                                    <div className={`device fbDL ${deviceSelected == device.device_name ? "selected" : ""}`} onClick={() => setDeviceInfo(device)} >
                                        <Smartphone className="deviceIcon" />
                                        <p className="devicelabel">{device.device_name}</p>
                                    </div>
                                )
                            }
                        })
                    ) : (
                        <div className="noDevicesBox fbDL">
                            <Wifi className="noDeviceIcon" />
                            <p className="noDeviceHeader">No other devices found</p>
                            <p className="noDeviceDesc">Make sure other devices are on the same Wi-Fi network and have <strong>LAN File Share</strong> open</p>
                            <p className="noDeviceDesc">If connected, try refreshing the page</p>
                        </div>
                    )
                }
            </div>
            {
                isSending && <Progress progress={progress} />
            }
            <button
                onClick={() => send()}
                className="sendBTN"
            >Send</button>
        </main>
    )
}