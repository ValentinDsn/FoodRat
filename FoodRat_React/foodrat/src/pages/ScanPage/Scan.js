import "./Scan.css";

import React, {useEffect} from 'react';
import axios from 'axios';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {components} from "react-select";
import {default as ReactSelect} from "react-select";
import no_image from '../../assets/img/no_image.jpg';
import {useMemo} from "react";
import {useAuthHeader} from "react-auth-kit";
import {toast} from "react-toastify";


//let previous_data;
const serverURL = process.env.REACT_APP_SERVER_URL;

function Scan() {

    const [openAddItem, setOpenAddItem] = React.useState(false);

    const [openManualAdd, setOpenManualAdd] = React.useState(false);

    const [openLocationAdd, setOpenLocationAdd] = React.useState(false);

    const [openPopup, setOpenPopup] = React.useState(false);

    const [locationName, setLocationName] = React.useState('');

    const [barcode, setBarcode] = React.useState("No result yet");

    const [collectionList, setCollectionList] = React.useState([]);

    const [optionSelected, setOptionSelected] = React.useState(null);

    const [isScannerActive, setIsScannerActive] = React.useState(true);

    const initialProductDetails = useMemo(() => {
        return {
            product_name: undefined,
            nutriscore_grade: undefined,
            image_front_url: undefined,
            image_front_small_url: undefined,
        }
    }, [])

    const [productDetails, setproductDetails] = React.useState(initialProductDetails)

    const authHeader = useAuthHeader();

    const addNewLocationOption = {value: 'add_new', label: 'Add new...'};

    useEffect(() => {
        if (productDetails !== initialProductDetails) {
            handleOpenAddItem()
        }

    }, [productDetails, initialProductDetails])

    /*function arraysEqual(a1,a2) {
        //WARNING: arrays must not contain {objects} or behavior may be undefined
        return JSON.stringify(a1)===JSON.stringify(a2);
    }*/

    function getCollectionsNames() {
        return new Promise((resolve, reject) => {
            axios.get(`${serverURL}/application/getAllLocations`, {headers: {"Authorization": authHeader()}})
                .then(response => {
                    const response_data = response.data;
                    let data_format = [];
                    response_data.forEach(element => {
                        if (element !== "users") {
                            data_format.push({label: element.name, value: element.name});
                        }
                    });

                    setCollectionList([...data_format, addNewLocationOption]);
                    resolve();
                })
                .catch(error => {
                    console.error("Error getting collection names:", error);
                    reject(error);
                });
        });
    }

    const getProductInfos = (barcode) => {
        return axios.get(`${serverURL}/application/getProductInfoFromApi/` + barcode, {headers: {"Authorization": authHeader()}})
            .then(response => {
                const respData = response.data;
                //If there is a response from the foodfact API
                if (!(Object.keys(respData).length === 0 && Object.getPrototypeOf(respData) === Object.prototype && respData.count === 1)) {
                    setproductDetails({
                        product_name: respData.products[0].product_name,
                        nutriscore_grade: respData.products[0].nutriscore_grade,
                        image_front_url: respData.products[0].image_front_url,
                        image_front_small_url: respData.products[0].image_front_small_url,
                    });
                    //If there is no image with the product
                    if (!respData.products[0].image_front_url) {
                        setproductDetails({
                            product_name: respData.products[0].product_name,
                            nutriscore_grade: respData.products[0].nutriscore_grade,
                            image_front_small_url: no_image,

                        })
                    }
                }
            })
            //If link not available
            .catch(() => {
                handleOpenManualAdd();
            });
    }
    const isFormValid = () => {
        if (optionSelected.value &&
            document.getElementById("name").value &&
            document.getElementById("quantity").value) {
            return true
        }
    }
    const addItemFromBarcode = () => {
        if (isFormValid()) {
            axios.post(`${serverURL}/application/` + optionSelected.value + '/addItem', {
                item_name: document.getElementById("name").value,
                item_barcode: barcode,
                item_quantity: document.getElementById("quantity").value,
                item_expiration_date: document.getElementById("expiration_date").value,
                item_nutriscore_grade: productDetails.nutriscore_grade,
                item_img: productDetails.image_front_url,
                item_img_small: productDetails.image_front_small_url,
                item_location: optionSelected.value
            }, {headers: {"Authorization": authHeader()}}).then(() => {
                handleCloseAddItem();
                toast("Item created!", {type: "success"});
            })
        } else {
            handleOpenPopup();
        }
    }
    const addItemManual = () => {
        if (isFormValid()) {
            axios.post(`${serverURL}/application/` + optionSelected.value + '/addItem', {
                item_name: document.getElementById("name").value,
                item_quantity: document.getElementById("quantity").value,
                item_expiration_date: document.getElementById("expiration_date").value,
                item_img: no_image,
                item_img_small: no_image,
                item_location: optionSelected.value
            }, {headers: {"Authorization": authHeader()}}).then(() => {
                handleCloseManualAdd();
                toast("Item created!", {type: "success"});
            })
        } else {
            handleOpenPopup();
        }
    }
    const AddLocation = () => {
        axios.post(`${serverURL}/application/createLocation/` + locationName, {},
            {headers: {"Authorization": authHeader()}})
            .then(() => {
                toast("Location created!", {type: "success"});
                getCollectionsNames().then(handleCloseLocationAdd);
            })
    }
    const handleOpenAddItem = () => {
        setIsScannerActive(false);
        setOpenAddItem(true);
    };
    const handleOpenPopup = () => {
        setOpenPopup(true);
    };
    const handleOpenManualAdd = () => {
        setIsScannerActive(false);
        getCollectionsNames()
            .then(() => {
                setOpenManualAdd(true); // Ouvre le pop-up une fois que getCollectionsNames a réussi
            })
            .catch((error) => {
                // Gérer les erreurs, par exemple en affichant un message d'erreur
                console.error("Error getting collection names:", error);
            });
    };
    const handleOpenLocationAdd = () => {
        setOpenLocationAdd(true);
    }
    const handleCloseAddItem = () => {
        setIsScannerActive(true);
        setOpenAddItem(false);
    };
    const handleClosePopup = () => {
        setOpenPopup(false);
    };
    const handleCloseManualAdd = () => {
        setIsScannerActive(true);
        setOpenManualAdd(false);
    };
    const handleCloseLocationAdd = () => {
        setOpenLocationAdd(false);
    }
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
    const localisationChange = (selectedOption) => {
        if (selectedOption.value === 'add_new') {
            handleOpenLocationAdd();
        } else {
            setOptionSelected(selectedOption);
        }
    };
    const newLocationName = (event) => {
        setLocationName(event.target.value);
    };


    return (
        <div>
            <div className={"scan-overlay"}></div>
            {isScannerActive && (
            <BarcodeScannerComponent
                onUpdate={async (err, result) => {
                    if (result) {
                        console.log(result)
                        setBarcode(result.text)
                        await getCollectionsNames();
                        getProductInfos(result.text);
                    } else setBarcode("No result yet");
                }}
            />
            )}

            <p className={"scan-barcode"}>Result: {barcode}</p>

            <div className={"scan-center-button"}>
                <Button onClick={handleOpenManualAdd} className={"scan-manual-button"}>Manual Add</Button>
            </div>

            <Dialog open={openAddItem} onClose={handleCloseAddItem}>
                <DialogTitle>Add product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To add this product, please verify the information and add an expiration date if necessary.
                    </DialogContentText>
                    <div>
                        <img className={"scan-logo-product"} src={productDetails.image_front_small_url} alt={"Logo"}/>
                    </div>
                    <TextField
                        style={{marginTop: 30, marginRight: 25}}
                        disabled
                        label="Barcode"
                        defaultValue={barcode}
                    />
                    <TextField
                        style={{marginTop: 30}}
                        label="Name"
                        id="name"
                        required={true}
                        defaultValue={productDetails.product_name}
                    />
                    <TextField
                        style={{marginTop: 30}}
                        disabled
                        label="Nutriscore"
                        defaultValue={productDetails.nutriscore_grade}
                        InputLabelProps={{shrink: true}}

                    />
                    {collectionList && (
                        <div
                            style={{marginTop: 30}}>
                            <ReactSelect
                                placeholder={"Choose a location..."}
                                options={collectionList}
                                closeMenuOnSelect={true}
                                hideSelectedOptions={false}
                                components={{
                                    Option
                                }}
                                onChange={localisationChange}
                                allowSelectAll={true}
                                value={optionSelected}
                            />
                        </div>
                    )}

                    <TextField
                        style={{marginTop: 20}}
                        autoFocus
                        margin="dense"
                        id="expiration_date"
                        label="Expiration date"
                        type="date"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{shrink: true}}
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
                            inputProps: {min: 0}
                        }}
                    />
                    <p className={"Scan-required-text"}>* Required</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddItem}>Cancel</Button>
                    <Button onClick={addItemFromBarcode}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openPopup} onClose={handleCloseAddItem}>
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
            <Dialog open={openManualAdd} onClose={handleCloseAddItem} item_img_small={no_image} >
                <DialogTitle>Add manually product</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        No barcode or barcode not recognize, please put the information's manually.
                    </DialogContentText>
                    <TextField
                        style={{marginTop: 50}}
                        label="Name"
                        id="name"
                        required={true}
                    />
                    <div
                        style={{marginTop: 40}}>
                        <ReactSelect
                            placeholder={"Choose a location..."}
                            options={collectionList}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                            components={{
                                Option
                            }}
                            onChange={localisationChange}
                            allowSelectAll={true}
                            value={optionSelected}
                        />
                    </div>
                    <TextField
                        style={{marginTop: 20}}
                        autoFocus
                        margin="dense"
                        id="expiration_date"
                        label="Expiration date"
                        type="date"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{shrink: true}}
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
                            inputProps: {min: 0}
                        }}
                    />
                    <p className={"Scan-required-text"}>* Required</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseManualAdd}>Cancel</Button>
                    <Button onClick={addItemManual}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openLocationAdd} onClose={handleCloseLocationAdd}>
                <DialogTitle>Add a location</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        If you want to add a location please add a name and press ok.
                    </DialogContentText>
                    <TextField
                        style={{marginTop: 50}}
                        label="Location name"
                        id="location_name"
                        required={true}
                        onChange={newLocationName}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={AddLocation}>Ok</Button>
                    <Button onClick={handleCloseLocationAdd}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>


    )
}

export default Scan;