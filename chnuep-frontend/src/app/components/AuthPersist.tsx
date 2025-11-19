"use client";

import { useGetMeQuery } from "@/lib/store/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/store/features/auth/authSlice";
import { useEffect } from "react";

export default function AuthPersist({ children }: { children: React.ReactNode }) {
    // Request is done automatically when mounting component
    const { data: user, isLoading } = useGetMeQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            dispatch(setCredentials(user));
        }
    }, [user, dispatch]);

    return <>{children}</>;
}