import { compare } from 'bcryptjs';
import axios from 'axios';
import { User, UserResponse } from '../interfaces/User';


export const login = async ({ username, password, img }: { username: string; password: string, img: string }) => {
    const response = await axios.get('/api/users');

    const users = response.data['users'] as UserResponse[];

    const user = users.find(user => user.username === username);

    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    
    const isPasswordEqual = await compare(password, user.password);

    if (!isPasswordEqual) {
        throw new Error('Senha incorreta.');
    }

    const faceMatch = await axios.post('/api/check', { img, username });

    if (faceMatch.status !== 200) {
        throw new Error('Não foi possível verificar sua identidade.');
    }

    const { result } = faceMatch.data as { result: boolean };

    if (!result) {
        throw new Error('Rosto incompatível com o usuário.');
    }

    return user;
};

export const registerUser = async ({ name, username, password, faceBase64 }: { name: string, username: string; password: string, faceBase64: string }) => {
    try {
        const response = await axios.post('/api/users', { name, username, password, faceBase64 } as User);

        return response.data as UserResponse;
    } catch (error) {
        throw new Error('Usuário já existe.');
    }
};

export const editUser = async ({ id, data }: { id: string, data: Partial<UserResponse> }) => {
    try {
        const response = await axios.put(`/api/users/${id}`, { ...data });
        
        return response.data as { message: string, user: UserResponse };
    } catch (error) {
        throw new Error('Usuário já utilizado.');
    }
};