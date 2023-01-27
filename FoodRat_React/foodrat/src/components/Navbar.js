import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { CiBarcode } from "react-icons/ci";
import "./Navbar.css";
import { ReactComponent as Logo } from '../assets/icons/logo.svg'

import {
    Link
} from 'react-router-dom';




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

                    <Link to={"/home"}>
                        <button
                            className={"main-btn"}
                            type="button">
                            <AiFillHome className={"btn-img"}/>Home
                        </button>
                    </Link>
                    <Link to={"/scan"}>
                        <button
                            className={"main-btn"}
                            type="button">
                            <CiBarcode className={"btn-img"}/>Scan
                        </button>
                    </Link>

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