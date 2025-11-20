"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Spin, Tabs, Button, List, Card, Tag, Empty } from 'antd';
import { FileTextOutlined, PlusOutlined, CalendarOutlined, BookOutlined, UploadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useGetCourseByIdQuery, useGetAssignmentsByCourseQuery } from '@/lib/store/features/courses/coursesApi';

import CreateAssignmentModal from '@/app/components/modals/create_assignment_modal';
import SubmitAssignmentModal from '@/app/components/modals/submit_assignment_modal';
import TeacherGradingModal from '@/app/components/modals/teacher_grading_modal';
import AdminEnrollmentModal from '@/app/components/modals/admin_enrollment_modal';

export default function CoursePage() {
    const { id } = useParams<{ id: string }>();

    const { user } = useSelector((state: RootState) => state.auth);

    const { data: course, isLoading: loadingCourse } = useGetCourseByIdQuery(id);
    const { data: assignments, isLoading: loadingAssignments } = useGetAssignmentsByCourseQuery(id);

    // Admin
    const isAdmin = user?.role === 'admin';
    const [isAdminEnrollModalOpen, setIsAdminEnrollModalOpen] = useState(false);

    // Assignment
    const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);

    // Grading
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
    const [gradingAssignment, setGradingAssignment] = useState<{ id: number, title: string } | null>(null);

    if (loadingCourse) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Spin size="large" tip="Завантаження курсу..." />
            </div>
        );
    }

    if (!course) {
        return <div className="text-center mt-10 text-xl text-red-500">Курс не знайдено</div>;
    }

    // Check if current user is a member of specific course
    const isTeacher = user?.role === 'teacher' && user?.id === course.teacher_id;
    const isStudent = user?.role === 'student';

    const handleOpenSubmit = (assignmentId: number) => {
        setSelectedAssignmentId(assignmentId);
        setIsSubmitModalOpen(true);
    };

    const handleOpenGrading = (assignment: any) => {
        setGradingAssignment({ id: assignment.id, title: assignment.title });
        setIsGradingModalOpen(true);
    };

    // Tasks tab
    const assignmentsTab = (
        <div>
            {/* Teacher only */}
            {isTeacher && (
                <div className="mb-4 flex justify-end">
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateAssignmentOpen(true)}>
                        Додати завдання
                    </Button>
                </div>
            )}

            {loadingAssignments ? <div className="text-center py-4"><Spin /></div> : assignments && assignments.length > 0 ? (
                <List
                    grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
                    dataSource={assignments}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                title={
                                    <div className="flex items-center gap-2">
                                        <FileTextOutlined className="text-blue-500" />
                                        <span>{item.title}</span>
                                    </div>
                                }
                                extra={
                                    isTeacher ? (
                                        <div className="flex gap-2">
                                            <Button onClick={() => handleOpenGrading(item)}>Переглянути роботи</Button>
                                            <Button type="link">Редагувати</Button>
                                        </div>
                                    ) : isStudent ? (
                                        <Button
                                            type="primary"
                                            ghost
                                            icon={<UploadOutlined />}
                                            onClick={() => handleOpenSubmit(item.id)}
                                        >
                                            Здати роботу
                                        </Button>
                                    ) : null
                                }
                            >
                                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{item.description}</p>

                                <div className="flex flex-wrap gap-4 text-gray-500 text-sm pt-4 border-t border-gray-100">
                                    <Tag color="blue">Макс. бал: {item.max_grade}</Tag>
                                    {item.due_date && (
                                        <span className="flex items-center gap-1">
                                            <CalendarOutlined />
                                            Дедлайн: {new Date(item.due_date).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Завдань поки немає" />
            )}
        </div>
    );

    const items = [
        {
            key: '1',
            label: 'Матеріали курсу',
            children: <div className="p-8 text-center text-gray-500 bg-white rounded-lg">Матеріали відсутні (В розробці)</div>,
        },
        {
            key: '2',
            label: 'Лабораторні роботи',
            children: assignmentsTab,
        },
        {
            key: '3',
            label: 'Учасники',
            children: (
                <div className="p-4">
                    {isAdmin ? (
                        <div className="text-center">
                            <p className="mb-4 text-gray-500">Керування доступом студентів до цього курсу.</p>
                            <Button type="primary" onClick={() => setIsAdminEnrollModalOpen(true)}>
                                Керувати учасниками
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            Тут буде список ваших одногрупників.
                        </div>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-blue-600">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-gray-800">
                    <BookOutlined /> {course.title}
                </h1>
                <p className="text-gray-600 text-lg mt-2">{course.description}</p>
            </div>


            <Tabs defaultActiveKey="2" items={items} type="card" size="large" />

            {/* For teacher: create task */}
            {isTeacher && (
                <CreateAssignmentModal
                    isOpen={isCreateAssignmentOpen}
                    onClose={() => setIsCreateAssignmentOpen(false)}
                    courseId={Number(id)}
                />
            )}

            {/* For student: submit his work */}
            {selectedAssignmentId && (
                <SubmitAssignmentModal
                    isOpen={isSubmitModalOpen}
                    onClose={() => setIsSubmitModalOpen(false)}
                    assignmentId={selectedAssignmentId}
                />
            )}

            {/* For teacher */}
            {gradingAssignment && (
                <TeacherGradingModal
                    isOpen={isGradingModalOpen}
                    onClose={() => setIsGradingModalOpen(false)}
                    assignmentId={gradingAssignment.id}
                    assignmentTitle={gradingAssignment.title}
                />
            )}

            {isAdmin && (
                <AdminEnrollmentModal
                    isOpen={isAdminEnrollModalOpen}
                    onClose={() => setIsAdminEnrollModalOpen(false)}
                    courseId={Number(id)}
                />
            )}
        </div>
    );
}