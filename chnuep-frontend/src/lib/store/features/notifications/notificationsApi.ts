import { api } from '../../api';

export interface Notification {
    id: number;
    message: string;
    is_read: boolean;
    created_at: string;
}

export const notificationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<Notification[], void>({
            query: () => '/notifications/',
        }),
        markRead: builder.mutation<void, number>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PATCH'
            })
        })
    }),
});

export const { useGetNotificationsQuery, useMarkReadMutation } = notificationsApi;