import axios from 'axios';

const getProductInfo = async (barcode) => {

    return await axios.get('https://world.openfoodfacts.org/api/v2/search?fields=code,product_name&code='+ barcode)
        .then(response => {
            console.log(response.data)
            return response.data
            })
        .catch(error => {console.log(error);
            return error;
        });
}

exports.getProductInfoFromApi = (req,res) => {
    return axios.get('https://world.openfoodfacts.org/api/v2/search?fields=code,product_name,nutriscore_grade,nutrient_levels&code=='+ req.params.barcode)
        .then(response => {
            res.send(response.data.products[0])
        })
        .catch(error => {console.log(error);
            return error;
        });
};

export {
    getProductInfo
};