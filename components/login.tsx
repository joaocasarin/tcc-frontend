import NextLink from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { login } from '../utils/frontend';
import styles from '../styles/Forms.module.css';
import mainStyles from '../styles/Home.module.css';
import { RefObject, useState } from 'react';
import { NextRouter } from 'next/router';
import MyAlert from './alert';
import { Button, CircularProgress, TextField } from '@mui/material';

interface Props {
    videoRef: RefObject<HTMLVideoElement>,
    canvasRef: RefObject<HTMLCanvasElement>,
    router: NextRouter
}

export default function Login({ videoRef, canvasRef, router }: Props) {
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success');

    const validationSchema = yup.object().shape({
        username: yup.string().required('Username is required'),
        password: yup.string().required('Password is required')
    });

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, handleSubmit, formState } = useForm<{ username: string, password: string }>(formOptions);
    const { errors } = formState;

    const onSubmit = async ({ username, password }: { username: string, password: string }) => {
        const context = canvasRef.current!.getContext("2d");
        context!.drawImage(videoRef.current!, 0, 0, 240, 180);

        const dataURL = canvasRef.current!.toDataURL("image/png");

        try {
            const user = await login({ username, password, img: dataURL });

            if (!!user) {
                router.push('/login');
            }

            videoRef.current!.pause();
            localStorage.setItem('user', JSON.stringify(user));
            router.push('/');
        } catch (error) {
            setAlertOpen(true);
            setAlertMessage((error as Error).message);
            setAlertSeverity('error');
        }
    };

    return(
        <main>
            <div className={styles.card}>
                <p className={mainStyles.title}>Entrar</p>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form} >
                    <div style={{ width: '100%' }}>
                        <TextField sx={{margin: '8px 0'}} label='Usuário' fullWidth size='small' error={!!errors.username} helperText={errors.username?.message} {...register('username')} />
                        <TextField sx={{margin: '8px 0'}} type='password' label='Senha' fullWidth size='small' error={!!errors.password} helperText={errors.password?.message} {...register('password')} />
                    </div>
                    <div>
                        <video className={styles.video} ref={videoRef} height="180" width="240" />
                    </div>
                    <canvas ref={canvasRef} height="180" width="240" hidden />
                    <div className={styles.buttons}>
                    <Button type='submit' variant='contained' disabled={formState.isSubmitting} >
                            {formState.isSubmitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Entrar'}
                        </Button>
                        <Button variant='outlined'>
                            <NextLink href={'/register'}>
                                Cadastrar
                            </NextLink>
                        </Button>
                    </div>
                </form>
            </div>
            <MyAlert severity={alertSeverity} message={alertMessage} open={alertOpen} setAlertOpen={setAlertOpen} />
        </main>
    );
}