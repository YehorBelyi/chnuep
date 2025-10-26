"use client";

import logo from "../../../../public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";
import { useState } from "react";
import LoginFormProcessing from "../forms/login_form";
import RegisterFormProcessing from "../forms/register_form";

const Header: React.FC = () => {
    const [isLoginModalOpened, setIsLoginModalOpened] = useState(false);
    const [isRegisterModalOpened, setIsRegisterModalOpened] = useState(false);

    return (
        <header className="bg-white shadow-xl fixed top-0 w-full z-10">
            <div className="w-full mx-auto max-w-screen-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-[60px] h-[60px]">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    </div>
                </div>

                <div>
                    <Link
                        href="/"
                        className="text-white bg-gray-700 
              hover:bg-gray-800 focus:ring-4 focus:ring-gray-300
              font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
              focus:outline-none"
                    >
                        Home
                    </Link>

                    <Button
                        type="primary"
                        className="mr-2"
                        onClick={() => setIsLoginModalOpened(true)}
                    >
                        Sign In
                    </Button>

                    <Button
                        type="default"
                        onClick={() => setIsRegisterModalOpened(true)}
                    >
                        Sign Up
                    </Button>

                    <LoginFormProcessing
                        isLoginModalOpened={isLoginModalOpened}
                        setIsLoginModalOpened={setIsLoginModalOpened}
                    />

                    <RegisterFormProcessing
                        isRegisterModalOpened={isRegisterModalOpened}
                        setIsRegisterModalOpened={setIsRegisterModalOpened}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
