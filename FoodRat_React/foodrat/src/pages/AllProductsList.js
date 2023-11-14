import React, {useEffect, useState} from 'react';
import "./AllProductsList.css"
import axios from 'axios';
import {differenceInDays, format, parseISO} from 'date-fns'
import TablePagination from '@mui/material/TablePagination';
import Navbar from "../components/Navbar";
import {useAuthHeader} from 'react-auth-kit';

const serverURL = process.env.REACT_APP_SERVER_URL;


const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);

    const sortedItems = React.useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {

            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';

        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({key, direction});
    };

    return {items: sortedItems, requestSort, sortConfig};
};

function ProductTable(props) {
    const {items, requestSort, sortConfig} = useSortableData(props.products);
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th></th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('item_name')}
                            className={getClassNamesFor('item_name')}
                        >
                            Name
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('item_quantity')}
                            className={getClassNamesFor('item_quantity')}
                        >
                            Quantity
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('item_location')}
                            className={getClassNamesFor('item_location')}
                        >
                            Location
                        </button>
                    </th>
                    <th>
                        <button
                            type="button"
                            onClick={() => requestSort('item_expiration_date')}
                            className={getClassNamesFor('item_expiration_date')}
                        >
                            Expiration Date
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody>
                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                    <tr key={item._id} className="products-item-row">
                        <td><img src={item.item_img_small} className={"products-list_img"} alt={"logo"}/></td>
                        <td>{item.item_name}</td>
                        <td>{item.item_quantity}</td>
                        <td>{item.item_location}</td>
                        <td id={"date"} className={getClassForExpiration(item.item_expiration_date)}>

                            {item.item_expiration_date ? (
                                <>
                                    {format(parseISO(item.item_expiration_date), 'dd/MM/yyyy')}, {getDiff(item.item_expiration_date)}
                                </>
                            ) : (
                                "No expiration date"
                            )}
                        </td>
                        <td className="products-item-content">
                            <div className="products-item-actions">
                                <button className="edit-button">Modifier</button>
                                <button className="delete-button">Supprimer</button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={5}>
                        <TablePagination
                            sx={{
                                ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel": {
                                    "marginTop": "1em",
                                    "marginBottom": "1em"

                                    //"margin-top": "1em",
                                    //"margin-bottom": "1em"
                                }
                            }}

                            component="div"
                            rowsPerPageOptions={[4, 8, 16]}
                            count={items.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </td>
                </tr>
                </tfoot>
            </table>
        </>
    )

}

function getClassForExpiration(expirationDate) {
    if (!expirationDate) {
        return "products-no-date"; // Couleur par défaut pour les produits sans date d'expiration
    }

    const currentDate = new Date();
    const diffInDays = differenceInDays(parseISO(expirationDate), currentDate);

    if (diffInDays < 0) {
        return "products-is-expired"; // Produit périmé (Rouge)
    } else if (diffInDays < 2) {
        return "products-is-expiring-soon"; // Produit qui expire dans moins de 2 jours (Orange)
    } else {
        return "products-is-valid"; // Produit valide (Vert)
    }
}

const getDiff = (date) => {
    if (date) {
        let today = (new Date()).getTime()
        today = format((today), 'dd/MM/yyyy')
        today = new Date(today.split('/')[2], today.split('/')[1] - 1, today.split('/')[0]);

        date = format(parseISO(date), 'dd/MM/yyyy')
        date = new Date(date.split('/')[2], date.split('/')[1] - 1, date.split('/')[0]);

        const diffDays = differenceInDays(date, today)

        if (date < today) {
            if (Math.abs(diffDays.toString()) === 1) {
                return ("Expired yesterday")
            } else {
                return ("Expired since " + Math.abs(diffDays.toString()) + " days")
            }
        }
        if (diffDays === 0) {
            return ("Expire today")
        }
        if (diffDays === 1) {
            return ("1 Day left")
        } else {
            return (diffDays.toString() + " Days left")
        }
    } else {
        return ("No expiration date")
    }
}

function AllProducts() {
    const [products, setProducts] = useState([])
    const [locations, setLocations] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const authHeader = useAuthHeader();

    // eslint-disable-next-line
    useEffect(() => {
        const getAllItems = async () => {
            await axios.get(`${serverURL}/application/`, {headers: {"Authorization": authHeader()}})

                .then(async response => {
                    const response_data = response.data;
                    setProducts(await response_data);
                })
        }

        const getAllLocations = async () => {
            await axios.get(`${serverURL}/application/getAllLocations`, {headers: {'Authorization': authHeader()}})

                .then(async response => {
                    const response_data = response.data;
                    setLocations(await response_data);
                })

        }
        getAllItems()
        getAllLocations()

        // eslint-disable-next-line
    }, [])

    const filterByLocation = (event) => {
        const locationName = event.target.value;
        if (locationName === 'All') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => product.item_location === locationName);
            setFilteredProducts(filtered);
        }
    };

    return (
        <main>
            <div>
                <Navbar/>
                <h1 className={"products-main-text"}>List of all products:</h1>
                <div className="products-filter-container">
                    <select onChange={filterByLocation} defaultValue="All">
                        <option key="all_option" value="All">All Locations</option>
                        {locations.map(location => (
                            <option key={location._id} value={location.name}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product table */}
                <ProductTable

                    products={filteredProducts.length > 0 ? filteredProducts : products}
                />
            </div>
        </main>
    )
}

export default AllProducts