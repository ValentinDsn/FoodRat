import React, {useEffect} from 'react';
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
import { components } from "react-select";
import { default as ReactSelect } from "react-select";



let previous_data;
function Scan (){

    const [data, setData] = React.useState("No result yet");

    const [open, setOpen] = React.useState(false);

    const [openPopup, setOpenPopup] = React.useState(false);

    const [barcode, setBarcode] = React.useState(false);

    const [collectionList,setcollectionList] = React.useState(false);

    const [optionSelected, setOptionSelected] = React.useState(false);

    const initialProductDetails = {
        product_name:undefined,
        nutriscore_grade:undefined,
    }
    const [productDetails, setproductDetails] = React.useState(initialProductDetails)

    useEffect(() => {
        if(productDetails!==initialProductDetails){
            Open()
        }
    },[productDetails])

    useEffect(() => {
        getCollectionsNames()
    },[])


    function arraysEqual(a1,a2) {
        /* WARNING: arrays must not contain {objects} or behavior may be undefined */
        return JSON.stringify(a1)===JSON.stringify(a2);

    }

    const getCollectionsNames = () => {
        axios.get('http://localhost:3000/application/getAllLocations')
            .then(response => {
                const response_data = response.data
                let data_format = []
                response_data.forEach( element => data_format.push({ label:element, value: element }));
                if(!arraysEqual(response_data,previous_data)){
                    setcollectionList(data_format);
                    previous_data=response_data.slice();
                }
            })
    }

    const getProductInfos = (barcode) => {
        axios.get('https://world.openfoodfacts.org/api/v2/search?fields=code,product_name,nutriscore_grade,nutrient_levels&code='+ barcode)
            .then(response => {
                const respData = response.data;
                if (!(Object.keys(respData).length === 0 && Object.getPrototypeOf(respData) === Object.prototype)) {
                    setproductDetails({
                        product_name: respData.products[0].product_name,
                        nutriscore_grade: respData.products[0].nutriscore_grade,
                    });
                }
            })
    }

    const Open = () => {
        setOpen(true);
    };

    const OpenPopup = () => {
        setOpenPopup(true);
    };

    const isFormValid = () => {
        if (optionSelected.value &&
            document.getElementById("name").value &&
            document.getElementById("expiration_date").value){
            return true
        }
    }

    const add = () => {
        if(isFormValid()){
            axios.post('http://localhost:3000/application/' + optionSelected.value +'/addItem', {
                item_name: document.getElementById("name").value,
                item_barcode: barcode,
                item_quantity: document.getElementById("quantity").value,
                item_expiration_date: document.getElementById("expiration_date").value,
                item_nutriscore_grade:productDetails.nutriscore_grade,
            }).then( () =>{
                handleClose();
            })
        } else {
            OpenPopup();
        }
    }

    const handleClose = () => {
        setOpen(false);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };


    const Option = (props) => {
        return (
            <div>
                <components.Option {...props}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                    />{" "}
                    <label>{props.label}</label>
                </components.Option>
            </div>
        );
    };


    return(
            <div>
                <BarcodeScannerComponent
                    onUpdate={async (err, result) => {
                        if (result){
                            setBarcode(result.text)
                            getCollectionsNames();
                            getProductInfos(result.text);
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
                        <TextField
                            style={{marginTop:50, marginRight:25}}
                            disabled
                            label="Barcode"
                            defaultValue={barcode}
                        />
                        <TextField
                            style={{marginTop:50}}
                            label="Name"
                            id="name"
                            required={true}
                            defaultValue={productDetails.product_name}
                        />
                        <TextField
                            style={{marginTop:50}}
                            disabled
                            label="Nutriscore"
                            defaultValue={productDetails.nutriscore_grade}
                            InputLabelProps={{ shrink: true }}

                        />
                        <div
                        style={{marginTop:40}}>
                            <ReactSelect
                                placeholder={"Choose a location..."}
                                options={collectionList}
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{
                                    Option
                                }}
                                onChange={setOptionSelected}
                                allowSelectAll={true}
                                value={optionSelected}
                            />
                        </div>

                        <TextField
                            style={{marginTop:20}}
                            autoFocus
                            margin="dense"
                            id="expiration_date"
                            label="Expiration date *"
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
                            required={true}
                            variant="standard"
                            InputProps={{
                                inputProps: { min: 0 }
                            }}
                        />
                        <p className={"RequiredText"}>* Required</p>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={add}>Add</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openPopup} onClose={handleClose}>
                    <DialogTitle>Form not complete</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You must at least specify a name, a location and a quantity, please check the form!
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClosePopup}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </div>


    )
}

export default Scan;