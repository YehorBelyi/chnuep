export interface RegisterValues {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterModalProps {
    isRegisterModalOpened: boolean;
    setIsRegisterModalOpened: (value: boolean) => void;
}
