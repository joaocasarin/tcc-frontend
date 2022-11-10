export interface User {
    name: string,
    username: string,
    password: string,
    faceBase64: string,
};

export interface UserResponse extends User {
    id: string
}