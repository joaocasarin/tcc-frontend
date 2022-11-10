import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { UserResponse } from '../interfaces/User';
import { editUser } from '../utils/frontend';
import { ChangeEvent, useState } from 'react';
import MyAlert from './alert';
import { NextRouter } from 'next/router';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: UserResponse;
    router: NextRouter;
}

export default function EditUser({ open, setOpen, user, router }: Props) {
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success');

    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState(user.password);

    const onSubmit = async () => {
        try {
            const data = {} as Partial<UserResponse>;

            if (name.length > 0) {
                data.name = name;
            }

            if (username.length > 0) {
                data.username = username;
            }

            if (password.length > 0) {
                data.password = password;
            }

            const newUser = (await editUser({ id: user.id, data })).user;

            const currUser = JSON.parse(localStorage.getItem('user') as string) as UserResponse;

            if (currUser.id === newUser.id) {
                localStorage.setItem('user', JSON.stringify(newUser));
            }

            router.reload();

            setOpen(false);
        } catch(error) {
            setAlertOpen(true);
            setAlertMessage((error as Error).message);
            setAlertSeverity('error');
        }
    };

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if(event.target.value.length > 0) {
            setName(event.target.value);
        }
    };

    const onUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if(event.target.value.length > 0) {
            setUsername(event.target.value);
        }
    };

    const onPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        if(event.target.value.length > 0) {
            setPassword(event.target.value);
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>
                Editar Usuário
                <IconButton onClick={() => setOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div style={{ width: '100%', height: '100%' }}>
                    <TextField sx={{margin: '8px 0'}} onChange={onNameChange} label='Nome' fullWidth size='small' />
                    <TextField sx={{margin: '8px 0'}} onChange={onUsernameChange} label='Usuário' fullWidth size='small' />
                    <TextField sx={{margin: '8px 0'}} onChange={onPasswordChange} label='Senha' fullWidth size='small' />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onSubmit} variant='contained' >
                    Editar
                </Button>
            </DialogActions>
            <MyAlert open={alertOpen} message={alertMessage} severity={alertSeverity} setAlertOpen={setAlertOpen} />
        </Dialog>
    );
}