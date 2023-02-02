import React from 'react';
import "./Home.css"
import foodWaste from '../assets/img/rat.png'


function Home (){
    return (
        <main>
        <div>
            <h1 className={"MainText"}>Welcome to FoodRat</h1>
            <h3 className={"SecondaryText"}>The anti Food-Waste Application !</h3>
            <img className={"MainImg"} src={foodWaste} alt="FoodWasteLogo" />
            <h4 className={"bottom"}>© Valou</h4>
        </div>
        </main>

)
}

export default Home