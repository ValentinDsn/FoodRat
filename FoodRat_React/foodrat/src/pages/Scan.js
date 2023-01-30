import React from 'react';
import axios from 'axios';
import "./Scan.css";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

class ScanClass extends React.Component{
    constructor(props) {
        super(props);
        this.product_name = {
            product_name:""
        }
        };

}

function Scan (){

    const [data, setData] = React.useState("No result yet");

    const [open, setOpen] = React.useState(false);

    const [initialValues, setInitialValues] = React.useState(false);


    const [productName, setproductName] = React.useState({
        product_name:""
    })

    const getAdvisoryTest = (barcode) => {
        axios.get('https://world.openfoodfacts.org/api/v2/search?fields=code,product_name,nutriscore_grade,nutrient_levels&code='+ barcode)
            .then(response => {
                const respData = response.data;
                if (!(Object.keys(respData).length === 0 && Object.getPrototypeOf(respData) === Object.prototype)) {
                    setproductName({
                        product_name: "TEST2",
                    });
                }


            })
    }

    const Open = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return(

            <div>
                <BarcodeScannerComponent
                    onUpdate={async (err, result) => {
                        if (result){
                            setInitialValues(result.text)
                            await getAdvisoryTest(result.text);
                            Open();
                            setData(result.text);
                        }
                        else setData("No result yet");
                    }}
                />
                <p>Result: {data}</p>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add product</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To add this product, please verify the information and add an expiration date if necessary.
                        </DialogContentText>
                        {productName.product_name}
                        <TextField
                            style={{marginTop:50, marginRight:25}}
                            disabled
                            label="Barcode"
                            defaultValue={initialValues}
                        />
                        <TextField
                            style={{marginTop:50}}
                            label="Name"
                            defaultValue=""
                        />
                        <TextField
                            style={{marginTop:20}}
                            autoFocus
                            margin="dense"
                            id="expiration_date"
                            label="Expiration date"
                            type="date"
                            fullWidth
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="quantity"
                            label="Quantity"
                            type="number"
                            fullWidth
                            variant="standard"
                            InputProps={{
                                inputProps: { min: 0 }
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleClose}>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
    )
}

export default Scan;