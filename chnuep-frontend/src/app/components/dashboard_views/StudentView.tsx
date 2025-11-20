"use client";
import { Card, Col, Row, Statistic, Progress, Spin, Empty, Button } from 'antd';
import { BookOutlined, CheckCircleOutlined, ClockCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useGetAllCoursesQuery } from '@/lib/store/features/courses/coursesApi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StudentView({ user }: { user: any }) {
    const router = useRouter();

    // 1. Отримуємо ВСІ курси з бекенду
    const { data: courses, isLoading } = useGetAllCoursesQuery();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Вітаємо, {user.full_name}! 👋</h2>

            {/* Статистика (поки що статична, це нормально для цього етапу) */}
            <Row gutter={16} className="mb-8">
                <Col span={8}>
                    <Card bordered={false} className="bg-blue-50">
                        <Statistic title="Доступних курсів" value={courses?.length || 0} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="bg-green-50">
                        <Statistic title="Здані роботи" value={0} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card bordered={false} className="bg-orange-50">
                        <Statistic title="Середній бал" value={0} suffix="/ 100" />
                    </Card>
                </Col>
            </Row>

            <h3 className="text-xl font-semibold mb-4">Всі доступні курси</h3>

            {/* 2. Логіка відображення курсів */}
            {isLoading ? (
                <div className="text-center py-10"><Spin size="large" /></div>
            ) : courses && courses.length > 0 ? (
                <Row gutter={[16, 16]}>
                    {courses.map((course) => (
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
                                            {/* Прогрес поки фейковий, бо немає Enrollments */}
                                            <Progress percent={0} size="small" status="active" />
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Empty description="На даний момент курсів немає" />
            )}
        </div>
    );
}