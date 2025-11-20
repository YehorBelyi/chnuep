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

export interface Submission {
    id: number;
    file_url: string;
    student_comment?: string;
    grade?: number;
    submitted_at: string;
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

        submitAssignment: builder.mutation<Submission, { assignmentId: number; file: File; comment: string }>({
            query: ({ assignmentId, file, comment }) => {
                const formData = new FormData();
                formData.append('file', file);
                if (comment) formData.append('student_comment', comment);

                return {
                    url: `/submissions/${assignmentId}`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Submissions'],
        }),
        getMySubmission: builder.query<Submission | null, number>({
            query: (assignmentId) => `/submissions/my/${assignmentId}`,
            providesTags: ['Submissions'],
        }),
    }),
});

export const {
    useCreateCourseMutation,
    useGetMyCoursesQuery,
    useGetAllCoursesQuery,
    useGetCourseByIdQuery,
    useCreateAssignmentMutation,
    useGetAssignmentsByCourseQuery,
    useSubmitAssignmentMutation,
    useGetMySubmissionQuery,
} = coursesApi;