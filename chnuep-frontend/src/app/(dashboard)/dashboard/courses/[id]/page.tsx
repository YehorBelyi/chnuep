"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Spin, Tabs, Button, List, Card, Tag, Empty } from 'antd';
import { FileTextOutlined, PlusOutlined, CalendarOutlined, BookOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useGetCourseByIdQuery, useGetAssignmentsByCourseQuery } from '@/lib/store/features/courses/coursesApi';
import CreateAssignmentModal from '@/app/components/modals/create_assignment_modal';

export default function CoursePage() {
    const { id } = useParams<{ id: string }>(); // Get ID from URL
    const { user } = useSelector((state: RootState) => state.auth);

    // Requests to API
    const { data: course, isLoading: loadingCourse } = useGetCourseByIdQuery(id);
    const { data: assignments, isLoading: loadingAssignments } = useGetAssignmentsByCourseQuery(id);

    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

    if (loadingCourse) return <div className="text-center mt-10"><Spin size="large" /></div>;
    if (!course) return <div className="text-center mt-10">Курс не знайдено</div>;

    const isTeacher = user?.role === 'teacher' && user?.id === course.teacher_id;

    // Assignments tab content
    const assignmentsTab = (
        <div>
            {isTeacher && (
                <div className="mb-4 flex justify-end">
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAssignmentModalOpen(true)}>
                        Додати завдання
                    </Button>
                </div>
            )}

            {loadingAssignments ? <Spin /> : assignments && assignments.length > 0 ? (
                <List
                    grid={{ gutter: 16, column: 1 }}
                    dataSource={assignments}
                    renderItem={(item) => (
                        <List.Item>
                            <Card
                                title={<span className="flex items-center gap-2"><FileTextOutlined /> {item.title}</span>}
                                extra={isTeacher ? <Button type="link">Редагувати</Button> : <Tag color="blue">Здати роботу</Tag>}
                            >
                                <p className="text-gray-600 mb-4">{item.description}</p>
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Макс. бал: {item.max_grade}</span>
                                    {item.due_date && <span><CalendarOutlined /> Дедлайн: {new Date(item.due_date).toLocaleDateString()}</span>}
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="Завдань поки немає" />
            )}
        </div>
    );

    const items = [
        {
            key: '1',
            label: 'Матеріали курсу',
            children: <div className="p-4"><Empty description="Матеріали відсутні (В розробці)" /></div>,
        },
        {
            key: '2',
            label: 'Лабораторні роботи',
            children: assignmentsTab,
        },
        {
            key: '3',
            label: 'Учасники',
            children: <div className="p-4">Список студентів (В розробці)</div>,
        },
    ];

    return (
        <div>
            {/* Course title */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-blue-500">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <BookOutlined /> {course.title}
                </h1>
                <p className="text-gray-600 text-lg">{course.description}</p>
            </div>

            {/* Tabs */}
            <Tabs defaultActiveKey="2" items={items} type="card" />

            <CreateAssignmentModal
                isOpen={isAssignmentModalOpen}
                onClose={() => setIsAssignmentModalOpen(false)}
                courseId={Number(id)}
            />
        </div>
    );
}