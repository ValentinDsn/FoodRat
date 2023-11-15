import React from 'react';
import "./Home.css"
import foodWaste from '../../assets/img/ratv2.jpg'
import Navbar from "../../components/Navbar/Navbar";

function Home (){
    return (
        <main>
        <div>
            <Navbar />
            <h1 className={"home-main-text"}>Welcome to FoodRat</h1>
            <h3 className={"home-secondary-text"}>The anti Food-Waste Application !</h3>
            <img src={foodWaste} className={"home-main-img"} alt="FoodWasteLogo" />
            <div className={"home-bottom"}>
                <h4 >© Valou</h4>
            </div>

        </div>
        </main>

)
}

export default Home;