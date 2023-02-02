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
    return axios.get('https://world.openfoodfacts.org/api/v2/search?fields=code,product_name,nutriscore_grade,nutrient_levels,,image_front_url,image_front_small_url&code=='+ req.params.barcode)
        .then(response => {
            res.status(200).json(response.data)
        })
        .catch(error => {console.log(error);
            res.status(404).json(error);
        });
};

export {
    getProductInfo
};