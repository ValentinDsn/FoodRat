import axios from 'axios';

const getProductInfo = async (barcode) => {

    return await axios.get('https://world.openfoodfacts.org/api/v2/search?fields=code,product_name&code='+ barcode)
        .then(response => {
            console.log("la")
            console.log(response.data)
            return response.data
            })
        .catch(error => {console.log(error);
            return error;
        });
}

export {
    getProductInfo
};