import React, { useState } from "react";
import "./../css/AddTrustee.css";
import UserBase from "../components/user/UserBase";
import { allUser, getToken, getUser } from "../services/user-service";
import { useEffect } from "react";
import { Paper, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";
import { Table } from "react-bootstrap";
import { Sidebar } from "react-pro-sidebar";
function AddBeneficiary() {
    const [category, setCategory] = useState([]);
    const getData = () => {
        let token = "Bearer" + getToken();
        allUser(token).then((res) => {
            setCategory(res);
        });
    };
    useEffect(() => {
        getData();
        base64ToImage();
    }, []);

    const columns = [
        {
            format: "image",
            id: "image",
            label: "Profile\u00a0Picture",
            style: {
                minWidth: 100,
                fontWeight: 'bold'
            },
        },
        {
            id: "firstName", label: "First\u00a0Name", style: {
                minWidth: 100,
                fontWeight: 'bold'
            }
        },
        {
            id: "lastName",
            label: "Last\u00a0Name",
            style: {
                minWidth: 100,
                fontWeight: 'bold'
            },
        },
        {
            id: "email",
            label: "Email\u00a0Id",
            style: {
                minWidth: 100,
                fontWeight: 'bold'
            },
        },
        {
            id: "action",
            label: "Request",
            format: "action",
            align: "center",
            style: {
                padding: 0,
                minWidth: 100,
                fontWeight: 'bold'
            }
        },
    ];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const base64ToImage = (base64String) => {
        const trimmedBase64 = base64String ? base64String.trim() : "";
        if (trimmedBase64) {
            return `data:image/jpeg;base64,${trimmedBase64}`;
        } else {

            return `./../../.././img/avtar.jpg`; // Return an empty string if no valid image data is available
        }
    };

    let user = getUser();


    return (
        <UserBase>
        <sidebar/>
            <div className="add_trustee_base">
                <Paper sx={{width: "fitContent", overflow: "hidden", border: "1px solid #cbcbcb", padding: "0px 10px", marginTop:"20px" }}>
                    <TableContainer sx={{ maxHeight: "580px"}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            className="myestate-table-header"
                                            key={column.id}
                                            align={column.align}
                                            style={column.style}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {category
                                    .filter((row) => row.id !== user.id)
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row) => {
                                        return (
                                            <TableRow
                                                hover
                                                role="checkbox"
                                                tabIndex={-1}
                                                key={row.code}
                                            >
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.format === "action" ? (
                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                    }}
                                                                >
                                                                    <button className="btn-sendRequest">Send Request</button>
                                                                </div>
                                                            ) : column.format === "image" ? (
                                                                <img
                                                                    src={base64ToImage(row.image)}
                                                                    alt="Profile"
                                                                    style={{
                                                                        width: "50px",
                                                                        height: "50px",
                                                                        objectFit: "cover",
                                                                        borderRadius: "50%",
                                                                        border: "2px solid lightgray",
                                                                        display: "flex",
                                                                        justifyContent:"center",
                                                                    }}
                                                                />
                                                            ) : (value || <span style={{ color: "red" }}>Incomplete</span>)}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={category.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

                <Paper>
                {/* <TableContainer sx={{ maxHeight: "580px"}}> */}
                
                        <table className="table2" border="1" cellSpacing="10" cellPadding="10">
                                <thead className="tablehead">
                                    <tr>
                                        <th>Profile Picture</th>
                                        <th>Full Name</th>
                                        <th>Email</th>
                                        <th>Request</th>
                                    </tr>
                                </thead>
                                <tbody className="tablebody">
                                    <tr>
                                        <td colSpan="" align="center">
                                            nothing yet
                                        </td>
                                        <td  align="center">
                                            nothing yet
                                        </td>
                                        <td  align="center">
                                            nothing yet
                                        </td>
                                        <td  align="center">
                                            nothing yet
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            ...
                                        </td>
                                        <td>
                                            ...
                                            </td>
                                            <td>
                                            ...
                                            </td>
                                            <td>
                                            ...
                                            </td>
                                                    
                                    </tr>
                                    

                                </tbody>

                        </table>
                    {/* </TableContainer> */}
                </Paper>
                
            </div>
        </UserBase>

    );
}

export default AddBeneficiary;
