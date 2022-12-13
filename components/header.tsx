import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { UserResponse } from "../interfaces/User";
import styles from '../styles/Header.module.css';

export default function Header() {
    const [ user, setUser ] = useState<UserResponse | null>(null);
    const router = useRouter();

    useEffect(() => {
        const data = localStorage.getItem('user');
        const ls = JSON.parse(data as string) as Partial<UserResponse>;

        if (data && ls?.id && ls?.name && ls?.username && ls?.password && ls?.faceBase64) {
            setUser(ls as UserResponse);
        }
    }, []);

    const onLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <header className={styles.header}>
            <h2 style={{ color: '#0070f3' }}>
                { user && `Bem vindo, ${user.name}.` }
            </h2>
            <h2>TCC - Website</h2>
            { user ? <Button variant="outlined" onClick={onLogout}>Sair</Button> : <div style={{margin: 0}}></div> }
        </header>
    )
}