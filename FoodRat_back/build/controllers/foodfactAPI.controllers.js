"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const getProductInfo = (barcode) => __awaiter(void 0, void 0, void 0, function* () {
    return yield axios_1.default.get('https://world.openfoodfacts.org/api/v2/search?fields=code,product_name&code=' + barcode)
        .then(response => {
        console.log(response.data);
        return response.data;
    })
        .catch(error => {
        console.log(error);
        return error;
    });
});
exports.getProductInfo = getProductInfo;
exports.getProductInfoFromApi = (req, res) => {
    return axios_1.default.get('https://world.openfoodfacts.org/api/v2/search?fields=code,product_name,nutriscore_grade,nutrient_levels&code==' + req.params.barcode)
        .then(response => {
        res.send(response.data.products[0]);
    })
        .catch(error => {
        console.log(error);
        return error;
    });
};
