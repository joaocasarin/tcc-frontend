import { yupResolver } from '@hookform/resolvers/yup';
import NextLink from 'next/link';
import { NextRouter } from 'next/router';
import { RefObject, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { registerUser } from '../utils/frontend';
import styles from '../styles/Forms.module.css';
import mainStyles from '../styles/Home.module.css';
import MyAlert from './alert';
import { Button, CircularProgress, TextField } from '@mui/material';

interface Props {
    videoRef: RefObject<HTMLVideoElement>,
    canvasRef: RefObject<HTMLCanvasElement>,
    router: NextRouter
}

export default function Register({ videoRef, canvasRef, router }: Props) {
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success');

    const validationSchema = yup.object().shape({
        name: yup.string().required('Name is required'),
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required')
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm<{ name: string, username: string, password: string }>(formOptions);
    const { errors } = formState;

    const onSubmit = async ({ name, username, password }: { name: string, username: string, password: string }) => {
        const context = canvasRef.current!.getContext("2d");
        context!.drawImage(videoRef.current!, 0, 0, 240, 180);

        const faceBase64 = canvasRef.current!.toDataURL("image/png");

        try {
            const user = await registerUser({ name, username, password, faceBase64 });

            if (user) {
                setAlertMessage('Usuário cadastrado com sucesso!');
                setAlertOpen(true);
                setAlertSeverity('success');
            }

        } catch(error) {
            setAlertOpen(true);
            setAlertMessage((error as Error).message);
            setAlertSeverity('error');
        }
    };

    return (
        <main>
            <div className={styles.card}>
                <p className={mainStyles.title}>Cadastro</p>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form} >
                    <div style={{ width: '100%' }}>
                        <TextField sx={{margin: '8px 0'}} label='Nome' fullWidth size='small' error={!!errors.name} helperText={errors.name?.message} {...register('name')} />
                        <TextField sx={{margin: '8px 0'}} label='Usuário' fullWidth size='small' error={!!errors.username} helperText={errors.username?.message} {...register('username')} />
                        <TextField sx={{margin: '8px 0'}} type='password' label='Senha' fullWidth size='small' error={!!errors.password} helperText={errors.password?.message} {...register('password')} />
                    </div>
                    <div>
                        <video className={styles.video} ref={videoRef} height="180" width="240" />
                    </div>
                    <canvas ref={canvasRef} height="180" width="240" hidden />
                    <div className={styles.buttons}>
                        <Button type='submit' variant='contained' disabled={formState.isSubmitting} >
                            {formState.isSubmitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Cadastrar'}
                        </Button>
                        <Button variant='outlined'>
                            <NextLink href={'/login'}>
                                Entrar
                            </NextLink>
                        </Button>
                    </div>
                </form>
            </div>
            <MyAlert severity={alertSeverity} message={alertMessage} open={alertOpen} setAlertOpen={setAlertOpen} />
        </main>
    );
}