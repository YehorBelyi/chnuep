export interface LoginValues {
    email: string;
    password: string;
}

export interface LoginModalProps {
    isLoginModalOpened: boolean;
    setIsLoginModalOpened: (open: boolean) => void;
}