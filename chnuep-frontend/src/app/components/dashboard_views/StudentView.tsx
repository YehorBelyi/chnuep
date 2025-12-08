"use client";
import React, { useMemo } from 'react';
import { Card, Col, Row, Statistic, Progress, Spin, Empty } from 'antd';
import { BookOutlined, CheckCircleOutlined, ArrowRightOutlined, TrophyOutlined } from '@ant-design/icons';
import { useGetMyCoursesQuery, useGetMyGradesQuery } from '@/lib/store/features/courses/coursesApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentView({ user }: { user: any }) {
    const router = useRouter();

    const { data: myCourses, isLoading: loadingCourses } = useGetMyCoursesQuery();
    const { data: gradesData, isLoading: loadingGrades } = useGetMyGradesQuery();

    const isLoading = loadingCourses || loadingGrades;

    const stats = useMemo(() => {
        if (!gradesData) return { totalSubmitted: 0, averageScore: 0 };

        let totalSubmitted = 0;
        let globalTotalGrade = 0;
        let globalMaxGrade = 0;

        gradesData.forEach(course => {
            course.assignments.forEach(assignment => {
                if (assignment.grade !== null) {
                    totalSubmitted += 1;
                }
            });

            globalTotalGrade += course.total_grade;
            globalMaxGrade += course.total_max_grade;
        });

        const averageScore = globalMaxGrade > 0
            ? Math.round((globalTotalGrade / globalMaxGrade) * 100)
            : 0;

        return { totalSubmitted, averageScore };
    }, [gradesData]);

    const getCourseProgress = (courseId: number) => {
        const courseStats = gradesData?.find(g => g.course_id === courseId);
        if (!courseStats || courseStats.total_max_grade === 0) return 0;

        return Math.round((courseStats.total_grade / courseStats.total_max_grade) * 100);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Вітаємо, {user.full_name}! 👋</h2>

            {/* Users stats */}
            <Row gutter={16} className="mb-8">
                <Col span={8}>
                    <Card bordered={false} className="bg-blue-50">
                        <Statistic title="Активні курси" value={myCourses?.length || 0} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="bg-green-50">
                        <Statistic title="Здані роботи" value={stats.totalSubmitted} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="bg-orange-50">
                        <Statistic title="Загальна успішність" value={stats.averageScore} suffix="%" prefix={<TrophyOutlined />} />
                    </Card>
                </Col>
            </Row>

            <h3 className="text-xl font-semibold mb-4">Всі доступні курси</h3>

            {/* Rendering available courses for students */}
            {isLoading ? (
                <div className="text-center py-10"><Spin size="large" /></div>
            ) : myCourses && myCourses.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {myCourses.map((course) => {
                        const progress = getCourseProgress(course.id);

                        return (
                            <Col xs={24} sm={12} md={8} lg={6} key={course.id}>
                                <Card
                                    hoverable
                                    className="h-full flex flex-col"
                                    cover={<div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl"><BookOutlined /></div>}
                                    actions={[
                                        <Link key="open" href={`/dashboard/courses/${course.id}`}>
                                            <span className="flex justify-center items-center gap-2">
                                                Перейти до курсу <ArrowRightOutlined />
                                            </span>
                                        </Link>
                                    ]}
                                >
                                    <Card.Meta
                                        title={<div className="truncate" title={course.title}>{course.title}</div>}
                                        description={
                                            <div>
                                                <div className="h-10 overflow-hidden text-ellipsis mb-2 text-gray-500">
                                                    {course.description}
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
                                        }
                                    />
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <Empty description="На даний момент курсів немає" />
            )}
        </div>
    );
}