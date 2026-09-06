import "../styles/Progress.css"

export default function Progress({progress}){
    const progressStyle = {
        backgroundColor: `${progress < 30 ? "#ff5a5a" : (progress < 75 ? "#ffbc60" : "#00c100")}`,
        width: `${progress}%`,
        height: "100%",

    }

    return (
        <div className="progressBarContainer">
            <div className="progressBar">
                <div style={progressStyle}></div>
            </div>
            <p className="progress">{progress === 100 ? "Sent ✓ " : "Sending ⇫ "} <span>{progress}%</span> </p>
        </div>
    )
}