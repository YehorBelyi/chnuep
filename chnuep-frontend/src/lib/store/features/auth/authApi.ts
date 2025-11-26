import { api } from '../../api';
import { LoginValues } from '@/app/types/LoginTypes';
import { RegisterValues } from '@/app/types/RegisterTypes';
import { User } from './authSlice';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<any, LoginValues>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<any, RegisterValues & { full_name: string }>({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                body: { ...data, role: 'student' },
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
        getMe: builder.query<any, void>({
            query: () => '/me',
        }),
        updateProfile: builder.mutation<User, { full_name: string }>({
            query: (body) => ({
                url: '/users/me',
                method: 'PUT',
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetMeQuery,
    useUpdateProfileMutation
} = authApi;