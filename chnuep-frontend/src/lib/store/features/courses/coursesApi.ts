import { api } from '../../api';

export interface Course {
    id: number;
    title: string;
    description: string;
    teacher_id: number;
}

export interface Assignment {
    id: number;
    title: string;
    description: string;
    max_grade: number;
    course_id: number;
    due_date?: string;
}

export const coursesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Create course
        createCourse: builder.mutation<Course, { title: string; description: string }>({
            query: (body) => ({
                url: '/courses/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Courses'], // Update cache
        }),
        // Get teachers courses
        getMyCourses: builder.query<Course[], void>({
            query: () => '/courses/my',
            providesTags: ['Courses'],
        }),
        // Get all courses
        getAllCourses: builder.query<Course[], void>({
            query: () => '/courses/',
            providesTags: ['Courses'],
        }),

        getCourseById: builder.query<Course, string>({
            query: (id) => `/courses/${id}`,
        }),
        createAssignment: builder.mutation<Assignment, Partial<Assignment>>({
            query: (body) => ({
                url: '/assignments/',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Assignments'],
        }),
        getAssignmentsByCourse: builder.query<Assignment[], string>({
            query: (courseId) => `/assignments/course/${courseId}`,
            providesTags: ['Assignments'],
        }),
    }),
});

export const {
    useCreateCourseMutation,
    useGetMyCoursesQuery,
    useGetAllCoursesQuery,
    useGetCourseByIdQuery,
    useCreateAssignmentMutation,
    useGetAssignmentsByCourseQuery
} = coursesApi;