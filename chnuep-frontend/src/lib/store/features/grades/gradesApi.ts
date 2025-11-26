import { api } from '../../api';
import { LoginValues } from '@/app/types/LoginTypes';
import { RegisterValues } from '@/app/types/RegisterTypes';

// Type for assignment
export interface GradeAssignment {
    assignment_id: number;
    title: string;
    grade: number | null;
    max_grade: number;
    teacher_comment?: string;
}

// Type for course
export interface CourseGrade {
    course_id: number;
    course_title: string;
    total_grade: number;
    total_max_grade: number;
    assignments: GradeAssignment[];
}

export const gradesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyGrades: builder.query<CourseGrade[], void>({
            query: () => '/grades/my',
            providesTags: ['Submissions'],
        }),
    }),
});
export const { useGetMyGradesQuery } = gradesApi;