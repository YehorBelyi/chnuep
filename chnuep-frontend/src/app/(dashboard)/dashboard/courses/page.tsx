"use client";

import React from 'react';
import { Typography, Row, Col, Card, Spin, Empty, Progress } from 'antd';
import { BookOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useGetMyCoursesQuery, useGetMyGradesQuery } from '@/lib/store/features/courses/coursesApi';
import Link from 'next/link';

const { Title } = Typography;

export default function MyCoursesPage() {
    const { data: courses, isLoading: loadingCourses } = useGetMyCoursesQuery();

    const { data: gradesData } = useGetMyGradesQuery();

    const getCourseProgress = (courseId: number) => {
        if (!gradesData) return 0;
        const courseStats = gradesData.find(g => g.course_id === courseId);
        if (!courseStats || courseStats.total_max_grade === 0) return 0;

        return Math.round((courseStats.total_grade / courseStats.total_max_grade) * 100);
    };

    if (loadingCourses) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Spin size="large" tip="Завантаження курсів..." />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 border-b pb-4">
                <Title level={2}>Мої Курси</Title>
                <p className="text-gray-500">
                    Перелік усіх дисциплін, до яких ви маєте доступ.
                </p>
            </div>

            {courses && courses.length > 0 ? (
                <Row gutter={[24, 24]}>
                    {courses.map((course) => {
                        const progress = getCourseProgress(course.id);

                        return (
                            <Col xs={24} sm={12} lg={8} xl={6} key={course.id}>
                                <Card
                                    hoverable
                                    className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow"
                                    cover={
                                        <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-5xl">
                                            <BookOutlined />
                                        </div>
                                    }
                                    actions={[
                                        <Link key="open" href={`/dashboard/courses/${course.id}`}>
                                            <span className="flex justify-center items-center gap-2 text-blue-600 font-medium py-2">
                                                Перейти до навчання <ArrowRightOutlined />
                                            </span>
                                        </Link>
                                    ]}
                                >
                                    <Card.Meta
                                        title={
                                            <div className="truncate text-lg mb-1" title={course.title}>
                                                {course.title}
                                            </div>
                                        }
                                        description={
                                            <div className="flex flex-col gap-3">
                                                <div className="h-10 overflow-hidden text-ellipsis text-gray-500 text-sm line-clamp-2">
                                                    {course.description}
                                                </div>

                                                <div>
                                                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                        <span>Прогрес</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <Progress
                                                        percent={progress}
                                                        size="small"
                                                        status={progress >= 100 ? "success" : "active"}
                                                        showInfo={false}
                                                        strokeColor={{
                                                            '0%': '#108ee9',
                                                            '100%': '#87d068',
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <div className="py-20 bg-white rounded-lg shadow-sm">
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div className="text-gray-500">
                                <p className="text-lg font-medium mb-2">Список курсів порожній</p>
                                <p>Схоже, вас ще не додали до жодного курсу.</p>
                            </div>
                        }
                    />
                </div>
            )}
        </div>
    );
}