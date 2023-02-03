import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { CiBarcode } from "react-icons/ci";
import { GiFruitBowl } from "react-icons/gi";
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
                <Link to={"/home"}>
                <div className="logo">
                    <Logo />
                </div>
                </Link>
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
                    <Link to={"/allProducts"}>
                        <button
                            className={"main-btn"}
                            type="button">
                            <GiFruitBowl className={"btn-img"}/>All
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