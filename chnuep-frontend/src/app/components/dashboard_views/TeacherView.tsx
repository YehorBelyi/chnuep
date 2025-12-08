"use client";
import { useState } from 'react';
import { Card, List, Button, Statistic, Row, Col, Empty, Spin } from 'antd';
import { PlusOutlined, FileTextOutlined, BookOutlined, RightOutlined } from '@ant-design/icons';
import CreateCourseModal from '../modals/create_course_modal';
import { useGetMyCoursesQuery, useGetPendingSubmissionsCountQuery } from '@/lib/store/features/courses/coursesApi';
import Link from 'next/link';

export default function TeacherView({ user }: { user: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: courses, isLoading: loadingCourses } = useGetMyCoursesQuery();

    const { data: pendingCount, isLoading: loadingStats } = useGetPendingSubmissionsCountQuery();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Панель Викладача 👨‍🏫</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
                    Створити новий курс
                </Button>
            </div>

            <Row gutter={16} className="mb-8">
                <Col span={12}>
                    <Card bordered={false} className="bg-blue-50 shadow-sm">
                        <Statistic
                            title="Активних курсів"
                            value={courses?.length || 0}
                            prefix={<BookOutlined />}
                            loading={loadingCourses}
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={false} className="bg-orange-50 shadow-sm">
                        <Statistic
                            title="Робіт на перевірку"
                            value={pendingCount || 0}
                            prefix={<FileTextOutlined />}
                            loading={loadingStats}
                            valueStyle={{ color: (pendingCount || 0) > 0 ? '#faad14' : '#3f8600' }}
                        />
                    </Card>
                </Col>
            </Row>

            <div className="grid grid-cols-1 gap-6">
                <Card title="Мої предмети" className="shadow-sm">
                    {loadingCourses ? (
                        <div className="text-center py-10"><Spin size="large" /></div>
                    ) : courses && courses.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={courses}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Link key="open" href={`/dashboard/courses/${item.id}`}>
                                            <Button type="link">Відкрити <RightOutlined /></Button>
                                        </Link>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl">
                                                <BookOutlined />
                                            </div>
                                        }
                                        title={
                                            <Link href={`/dashboard/courses/${item.id}`} className="text-lg font-medium hover:text-blue-600">
                                                {item.title}
                                            </Link>
                                        }
                                        description={
                                            <span className="text-gray-500 line-clamp-1">
                                                {item.description}
                                            </span>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Ви ще не створили жодного курсу"
                        >
                            <Button type="primary" onClick={() => setIsModalOpen(true)}>Створити перший курс</Button>
                        </Empty>
                    )}
                </Card>
            </div>

            <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}