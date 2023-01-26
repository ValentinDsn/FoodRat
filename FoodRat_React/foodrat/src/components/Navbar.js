import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import "./Navbar.css";
import { ReactComponent as Logo } from '../assets/icons/logo.svg'



function Navbar() {
    const navRef = useRef();

    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    };

    return (
        <header>
            <div className="logo">
                <Logo />
            </div>
            <nav ref={navRef}>

                    <button
                        className={"nav-btn"}
                        type="button">
                        <AiFillHome/>Home
                    </button>


                <a href="/#">Scan</a>
                <a href="/meh">All products</a>
                <a href="/#">By category</a>
                <button
                    className="nav-btn nav-close-btn"
                    onClick={showNavbar}>
                    <FaTimes />
                </button>
            </nav>
            <button className="nav-btn" onClick={showNavbar}>
                <FaBars />
            </button>
        </header>
    );
}

export default Navbar;