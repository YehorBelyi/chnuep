import { api } from '../../api';
import { User } from '../auth/authSlice';

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
    teacher_comment?: string;
    status: string;
    submitted_at: string;
    student?: {
        full_name: string;
        email: string;
        avatar_url?: string;
    };
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
        getSubmissionsForAssignment: builder.query<Submission[], number>({
            query: (assignmentId) => `/submissions/assignment/${assignmentId}`,
            providesTags: ['Submissions'],
        }),
        // Mark users submission
        gradeSubmission: builder.mutation<Submission, { id: number; grade: number; comment: string }>({
            query: ({ id, grade, comment }) => ({
                url: `/submissions/${id}`,
                method: 'PATCH',
                body: { grade, teacher_comment: comment },
            }),
            invalidatesTags: ['Submissions'],
        }),
        // Enroll student (ADMIN)
        adminEnrollStudent: builder.mutation<void, { studentId: number; courseId: number }>({
            query: (body) => ({
                url: '/enrollments/',
                method: 'POST',
                body: { student_id: body.studentId, course_id: body.courseId },
            }),
            invalidatesTags: ['Enrollments'],
        }),

        // Get list of students on this course
        getCourseStudents: builder.query<User[], number>({
            query: (courseId) => `/enrollments/${courseId}/students`,
            providesTags: ['Enrollments'],
        }),

        // Get all students
        getAllStudents: builder.query<User[], void>({
            query: () => '/students',
        }),
        getMaterials: builder.query<{ id: number, title: string, file_url: string }[], number>({
            query: (courseId) => `/materials/${courseId}`,
            providesTags: ['Materials'],
        }),
        uploadMaterial: builder.mutation<void, { courseId: number, title: string, file: File }>({
            query: ({ courseId, title, file }) => {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('file', file);
                return {
                    url: `/materials/${courseId}`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Materials'],
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
    useGetSubmissionsForAssignmentQuery,
    useGradeSubmissionMutation,
    useAdminEnrollStudentMutation,
    useGetCourseStudentsQuery,
    useGetAllStudentsQuery,
    useGetMaterialsQuery,
    useUploadMaterialMutation
} = coursesApi;