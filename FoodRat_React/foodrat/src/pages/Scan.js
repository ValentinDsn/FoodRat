import React from 'react';
import "./Scan.css";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function Scan (){
    const [data, setData] = React.useState("No result yet");

    return(
            <div>
                <BarcodeScannerComponent
                    onUpdate={(err, result) => {
                        if (result) setData(result.text);
                        else setData("No result yet");
                    }}
                />
                <p>Result: {data}</p>
            </div>
    )
}

export default Scan;