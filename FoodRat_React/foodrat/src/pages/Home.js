import React from 'react';
import "./Home.css"
import foodWaste from '../assets/img/ratv2.jpg'
import Navbar from "../components/Navbar";


function Home (){
    return (
        <main>
        <div>
            <Navbar />
            <h1 className={"MainText"}>Welcome to FoodRat</h1>
            <h3 className={"SecondaryText"}>The anti Food-Waste Application !</h3>
            <img src={foodWaste} className={"MainImg"} alt="FoodWasteLogo" />
            <div className={"bottom"}>
                <h4 >© Valou</h4>
            </div>

        </div>
        </main>

)
}

export default Home;