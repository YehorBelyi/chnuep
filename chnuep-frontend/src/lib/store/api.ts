import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000', // backend
        credentials: 'include', // allows browser to process cookies
    }),
    tagTypes: ['User', 'Courses', 'Assignments', 'Submissions'], // Caching data about this user
    endpoints: () => ({}),
});