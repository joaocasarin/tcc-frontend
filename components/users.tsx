import { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import axios from "axios";
import { UserResponse } from "../interfaces/User";
import EditUser from "./editUser";
import { useRouter } from "next/router";

export default function Users({ currUser }: { currUser: UserResponse }) {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse>({id: '', name: '', username: '', password: '', faceBase64: ''} as UserResponse);
    const [users, setUsers] = useState<UserResponse[]>([] as UserResponse[]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get('/api/users');
                setUsers(data['users'] as UserResponse[]);
            } catch (error) {
                console.log((error as Error).message);
            }
        })()
    }, []);

    const onEdit = async (u: UserResponse) => {
        setUser(u);
        setOpen(true);
    }

    const onDelete = async (id: string) => {
        try {
            await axios.delete(`/api/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch(error) {
            console.log((error as Error).message);
        }
    };
    
    return (
        <main>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', height: '500px' }}>
            <h1>Usuários</h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{fontWeight: 'bold'}}>ID</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Nome</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Usuário</TableCell>
                            <TableCell sx={{fontWeight: 'bold'}}>Ação</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {users.map(u => (
                        <TableRow key={u.id}>
                            <TableCell>{u.id}</TableCell>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.username}</TableCell>
                            <TableCell>
                                {currUser.id !== u.id ? null : 
                                    <IconButton onClick={() => onEdit(u)}>
                                        <EditIcon color="primary" />
                                    </IconButton>
                                }
                                {currUser.id !== u.id ? null : 
                                    <IconButton onClick={() => onDelete(u.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
            <EditUser open={open} setOpen={setOpen} router={router} user={user} />
        </main>
    )
}