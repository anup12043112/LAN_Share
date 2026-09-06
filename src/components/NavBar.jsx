import "../styles/Navbar.css"
import { WifiSync } from "lucide-react"
import gh from "../assets/gh.png"
import ig from "../assets/ig.png"
import Li from "../assets/Li.png"

export default function NavBar() {
    return (
        <nav className="nav fbnav">
            <div className="fbnav">
                <WifiSync className="iconStyle" />
                <p className="navHeading">LAN File Share</p>
            </div>
            <div className="fbnav">
                <a href="">
                    <img src={gh} alt="" />
                </a>
                <a href="">
                    <img src={ig} alt="" />
                </a>
                <a href="">
                    <img src={Li} alt="" />
                </a>
            </div>
        </nav>
    )
}