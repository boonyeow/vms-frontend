
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';






const UserList = ()=>{
    const columns = [
        {field:'userName', headerName: 'Username' },
        {field:'email', headerName:'Email'}
        // not so sure about the filter
    ];
    // hard-code for demo purpose
    const rows = [
        {username:'abc', email:'abc@gmail.com'},
        {username:'def', email:'def@gmail.com'}
    ];
    return (
        <>
        <TableContainer>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell>{columns[0].headerName}</TableCell>
                        <TableCell>{columns[1].headerName}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow
                        key={row.username}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {row.username}
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                    </TableRow>
          ))}
                    <TableRow>
                        
                    </TableRow>

                </TableBody>
            </Table>
        </TableContainer>
        </>
    );
};
export default UserList;