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
import no_image from '../assets/img/no_image.jpg';
import {useMemo} from "react";
import Snackbar from '@mui/material/Snackbar';
import Navbar from "../components/Navbar";


let previous_data;
const serverURL = process.env.REACT_APP_SERVER_URL;

function Scan (){

    const [data, setData] = React.useState("No result yet");

    const [open, setOpen] = React.useState(false);

    const [openSnackBar, setopenSnackBar] = React.useState(false);

    const [openManualAdd, setOpenManualAdd] = React.useState(false);

    const [openPopup, setOpenPopup] = React.useState(false);

    const [barcode, setBarcode] = React.useState(false);

    const [collectionList,setcollectionList] = React.useState(false);

    const [optionSelected, setOptionSelected] = React.useState(false);

    const initialProductDetails = useMemo(() => {
        return {
            product_name:undefined,
            nutriscore_grade:undefined,
            image_front_url:undefined,
            image_front_small_url:undefined,
        }
    }, [])


    const [productDetails, setproductDetails] = React.useState(initialProductDetails)

    useEffect(() => {
        if(productDetails!==initialProductDetails){
            Open()
        }

    },[productDetails, initialProductDetails])

    function arraysEqual(a1,a2) {
        /* WARNING: arrays must not contain {objects} or behavior may be undefined */
        return JSON.stringify(a1)===JSON.stringify(a2);
    }

    const getCollectionsNames = React.useCallback(() => {
        axios.get(`${serverURL}/application/getAllLocations`)
            .then(response => {
                const response_data = response.data
                let data_format = []
                response_data.forEach( element =>  {
                    if (element !== "users") {
                        data_format.push({ label: element, value: element });
                    }
                })

                if(!arraysEqual(response_data,previous_data)){
                    setcollectionList(data_format);
                    previous_data=response_data.slice();
                }
            })
    },[])

    useEffect(() => {
        getCollectionsNames();
    },[getCollectionsNames])

    const getProductInfos = (barcode) => {
            return axios.get(`${serverURL}/application/getProductInfoFromApi/`+ barcode)
                .then(response => {
                    const respData = response.data;
                    //If there is a response from the foodfact API
                    if (!(Object.keys(respData).length === 0 && Object.getPrototypeOf(respData) === Object.prototype && respData.count===1)) {
                        setproductDetails({
                            product_name: respData.products[0].product_name,
                            nutriscore_grade: respData.products[0].nutriscore_grade,
                            image_front_url:respData.products[0].image_front_url,
                            image_front_small_url:respData.products[0].image_front_small_url,
                        });
                        //If there is no image with the product
                        if(!respData.products[0].image_front_url){
                            setproductDetails({
                                product_name: respData.products[0].product_name,
                                nutriscore_grade: respData.products[0].nutriscore_grade,
                                image_front_small_url:no_image,

                            })
                        }
                    }
                })
                //If link not available
                .catch(() => {
                    OpenManualAdd();
                });
    }

    const Open = () => {
        setOpen(true);
    };

    const OpenPopup = () => {
        setOpenPopup(true);
    };

    const OpenManualAdd = () => {
        getCollectionsNames();
        setOpenManualAdd(true);
    };

    const OpenSnackBar = () => {
        setopenSnackBar(true);
    };

    const isFormValid = () => {
        if (optionSelected.value &&
            document.getElementById("name").value &&
            document.getElementById("quantity").value){
            return true
        }
    }

    const add = () => {
        if(isFormValid()){
            axios.post(`${serverURL}/application/` + optionSelected.value +'/addItem', {
                item_name: document.getElementById("name").value,
                item_barcode: barcode,
                item_quantity: document.getElementById("quantity").value,
                item_expiration_date: document.getElementById("expiration_date").value,
                item_nutriscore_grade:productDetails.nutriscore_grade,
                item_img:productDetails.image_front_url,
                item_img_small:productDetails.image_front_small_url,
                item_location:optionSelected.value
            }).then( () =>{
                handleClose();
                OpenSnackBar();
            })
        } else {
            OpenPopup();
        }
    }

    const manualAdd = () => {
        if(isFormValid()){
            axios.post(`${serverURL}/application/` + optionSelected.value +'/addItem', {
                item_name: document.getElementById("name").value,
                item_quantity: document.getElementById("quantity").value,
                item_expiration_date: document.getElementById("expiration_date").value,
                item_img:no_image,
                item_img_small:no_image,
                item_location:optionSelected.value
            }).then( () =>{
                handleCloseManualAdd();
                OpenSnackBar();
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

    const handleCloseManualAdd = () => {
        setOpenManualAdd(false);
    };

    const handleCloseSnackBar = () => {
        setopenSnackBar(false);
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
                <Navbar />
                <div className={"Meh"}></div>
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

                <p className={"Barcode"}>Result: {data}</p>

                <div className={"center"}>
                    <Button onClick={OpenManualAdd} className={"ManualButton"}>Manual Add</Button>
                </div>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Add product</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To add this product, please verify the information and add an expiration date if necessary.
                        </DialogContentText>
                        <div>
                            <img className={"logo_Product"} src={productDetails.image_front_small_url} alt={"Logo"}/>
                        </div>
                        <TextField
                            style={{marginTop:30, marginRight:25}}
                            disabled
                            label="Barcode"
                            defaultValue={barcode}
                        />
                        <TextField
                            style={{marginTop:30}}
                            label="Name"
                            id="name"
                            required={true}
                            defaultValue={productDetails.product_name}
                        />
                        <TextField
                            style={{marginTop:30}}
                            disabled
                            label="Nutriscore"
                            defaultValue={productDetails.nutriscore_grade}
                            InputLabelProps={{ shrink: true }}

                        />
                        <div
                        style={{marginTop:30}}>
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

                <Dialog
                    open={openManualAdd}
                    onClose={handleClose}
                    item_img_small={no_image}
                >
                    <DialogTitle>Add manually product</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            No barcode or barcode not recognize, please put the information's manually.
                        </DialogContentText>
                    <TextField
                        style={{marginTop:50}}
                        label="Name"
                        id="name"
                        required={true}
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
                        label="Expiration date"
                        type="date"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        defaultValue={""}
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
                        <Button onClick={handleCloseManualAdd}>Cancel</Button>
                        <Button onClick={manualAdd}>Add</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={openSnackBar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackBar}
                    message="Item created !"
                />
            </div>


    )
}

export default Scan;