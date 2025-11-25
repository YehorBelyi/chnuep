import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000', // backend
        credentials: 'include', // allows browser to process cookies
    }),
    refetchOnMountOrArgChange: true, // forces Redux to update data every time component mounts
    tagTypes: ['User', 'Courses', 'Assignments', 'Submissions', 'Enrollments', 'Materials'], // Caching data about this user
    endpoints: () => ({}),
});