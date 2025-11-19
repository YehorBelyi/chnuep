"use client";

import logo from "../../../../public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { Button, Dropdown, Avatar, MenuProps, Space } from "antd";
import { UserOutlined, LogoutOutlined, DashboardOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

// Імпортуємо модалки напряму (старі Processing файли видалити!)
import LoginModal from "../modals/login_modal";
import RegisterModal from "../modals/register_modal";

// Redux imports
import { RootState } from "@/lib/store/store";
import { useLogoutMutation } from "@/lib/store/features/auth/authApi";
import { logout as logoutAction } from "@/lib/store/features/auth/authSlice";

const Header: React.FC = () => {
    const [isLoginModalOpened, setIsLoginModalOpened] = useState(false);
    const [isRegisterModalOpened, setIsRegisterModalOpened] = useState(false);

    const router = useRouter();
    const dispatch = useDispatch();

    // Отримуємо стан користувача з Redux
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [logoutApi] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap(); // Виклик API (очистка cookies)
            dispatch(logoutAction()); // Очистка Redux store
            router.push("/"); // Редірект на головну
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // Меню для авторизованого користувача
    const userMenuItems: MenuProps['items'] = [
        {
            key: '1',
            label: <Link href="/dashboard">Особистий кабінет</Link>,
            icon: <DashboardOutlined />,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Вийти',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <>
            <header className="bg-white shadow-md fixed top-0 w-full z-50">
                <div className="w-full mx-auto max-w-screen-xl p-4 flex items-center justify-between">
                    {/* Логотип */}
                    <Link href="/" className="flex items-center gap-4">
                        <div className="w-[50px] h-[50px]">
                            <Image
                                src={logo}
                                alt="CHNU Logo"
                                width={100}
                                height={100}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <span className="font-bold text-xl hidden sm:block text-gray-800">
                            CHNUEP
                        </span>
                    </Link>

                    {/* Права частина хедера */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-blue-600 font-medium text-sm hidden md:block"
                        >
                            Головна
                        </Link>

                        {isAuthenticated && user ? (
                            // --- Якщо користувач авторизований ---
                            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                                <Space className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition">
                                    <Avatar
                                        src={user.avatar_url}
                                        icon={!user.avatar_url && <UserOutlined />}
                                        style={{ backgroundColor: '#1890ff' }}
                                    />
                                    <span className="font-medium text-gray-700 hidden sm:block">
                                        {user.full_name || user.email}
                                    </span>
                                </Space>
                            </Dropdown>
                        ) : (
                            // --- Якщо гість ---
                            <div className="flex gap-2">
                                <Button
                                    type="primary"
                                    onClick={() => setIsLoginModalOpened(true)}
                                >
                                    Увійти
                                </Button>
                                <Button
                                    onClick={() => setIsRegisterModalOpened(true)}
                                >
                                    Реєстрація
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Модальні вікна рендеримо завжди, керуємо видимістю через props */}
            <LoginModal
                isLoginModalOpened={isLoginModalOpened}
                setIsLoginModalOpened={setIsLoginModalOpened}
            />
            <RegisterModal
                isRegisterModalOpened={isRegisterModalOpened}
                setIsRegisterModalOpened={setIsRegisterModalOpened}
            />
        </>
    );
};

export default Header;