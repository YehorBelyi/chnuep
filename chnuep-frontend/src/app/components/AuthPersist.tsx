"use client";

import { useGetMeQuery } from "@/lib/store/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/store/features/auth/authSlice";
import { useEffect } from "react";

export default function AuthPersist({ children }: { children: React.ReactNode }) {
    // Запит виконується автоматично при монтуванні компонента
    const { data: user, isLoading } = useGetMeQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            dispatch(setCredentials(user));
        }
    }, [user, dispatch]);

    // Можна додати красивий спіннер завантаження на весь екран тут
    // if (isLoading) return <div>Loading...</div>;

    return <>{children}</>;
}