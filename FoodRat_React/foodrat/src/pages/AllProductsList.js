import React, {useEffect, useState} from 'react';
import "./AllProductsList.css"
import axios from "axios";

let response_data;
function Home (){
    const[products,setProducts] = useState(localStorage.getItem('products'))

    const getAllItems =  React.useCallback(async () => {
        await axios.get('http://localhost:3000/application/')
            .then (response => {
                response_data = response.data;
                localStorage.setItem('products',JSON.stringify(response_data))
            })
    },[])

    useEffect(() => {
        getAllItems().then(()=>{
            const data = localStorage.getItem(products)
            if(data){
                setProducts(JSON.parse(data))
            }
            console.log(JSON.parse(products))

        })

        }, [products, getAllItems])






    return (

        <main>
            <div>
                <h1 className={"MainText"}>Liste:</h1>
            </div>
        </main>

    )
}

export default Home