import React, {useEffect, useState} from 'react';
import "./AllProductsList.css"
import axios from "axios";
import {differenceInDays, format, parseISO} from 'date-fns'
import TablePagination from '@mui/material/TablePagination';


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
            setSortConfig({ key, direction });
        };

        return { items: sortedItems, requestSort, sortConfig };
    };
    function ProductTable(props) {
        const { items, requestSort, sortConfig } = useSortableData(props.products);
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
                    <tbody>
                    <tr>
                        <TablePagination
                            style={{
                                justifyContent:"center",
                                display:'flex'
                            }}
                            rowsPerPageOptions={[4,8,16]}
                            count={100}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </tr>

                    </tbody>
                </table>

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
                        <tr key={item._id} className="item-row">
                            <td><img src={item.item_img_small} className={"list_img"} alt={"logo"}/></td>
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
                            <td className="item-content" >
                                <div className="item-actions">
                                    <button className="edit-button">Modifier</button>
                                    <button className="delete-button">Supprimer</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </>

        )

    }

function getClassForExpiration(expirationDate) {
    if (!expirationDate) {
        return "no_date"; // Couleur par défaut pour les produits sans date d'expiration
    }

    const currentDate = new Date();
    const diffInDays = differenceInDays(parseISO(expirationDate), currentDate);

    if (diffInDays < 0) {
        return "is_expired"; // Produit périmé (Rouge)
    } else if (diffInDays < 2) {
        return "is_expiring_soon"; // Produit qui expire dans moins de 2 jours (Orange)
    } else {
        return "is_valid"; // Produit valide (Vert)
    }
}

    const getDiff = (date) => {
        if(date){
            let today = (new Date()).getTime()
            today = format((today),'dd/MM/yyyy')
            today = new Date(today.split('/')[2],today.split('/')[1]-1,today.split('/')[0]);

            date = format(parseISO(date),'dd/MM/yyyy')
            date = new Date(date.split('/')[2],date.split('/')[1]-1,date.split('/')[0]);

            const diffDays = differenceInDays(date, today)

            if(date<today){
                if(Math.abs(diffDays.toString()) === 1) {
                    return ("Expired yesterday")
                } else {
                    return ("Expired since " + Math.abs(diffDays.toString()) + " days")
                }
            }
            if(diffDays===0){
                return ("Expire today")
            }
            if(diffDays===1){
                return ("1 Day left")
            }
            else {
                return (diffDays.toString()+" Days left")
            }
        } else {
            return ("No expiration date")
        }


    }
function Home (){
    const[products,setProducts] = useState([])

    const getAllItems =  async () => {
        await axios.get('http://localhost:3000/application/')
            .then (async response => {
                const response_data = response.data;
                setProducts(await response_data);
            })
    }

    useEffect(() => {
        getAllItems()
    }, [])


    return (
        <main>
        <div>
            <h1 className={"MainText"}>List of all products:</h1>
            <ProductTable
                products={products}
            />
        </div>
        </main>
    )
}

export default Home