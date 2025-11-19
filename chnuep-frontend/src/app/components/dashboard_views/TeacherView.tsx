"use client";
import { useState } from 'react';
import { Card, List, Button, Statistic, Row, Col, Empty, Spin } from 'antd';
import { PlusOutlined, FileTextOutlined, BookOutlined } from '@ant-design/icons';
import CreateCourseModal from '../modals/create_course_modal';
import { useGetMyCoursesQuery } from '@/lib/store/features/courses/coursesApi';

export default function TeacherView({ user }: { user: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Getting courses from backend
    const { data: courses, isLoading } = useGetMyCoursesQuery();

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
                    <Card>
                        <Statistic title="Активних курсів" value={courses?.length || 0} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic title="Робіт на перевірку" value={0} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
            </Row>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Мої предмети">
                    {isLoading ? (
                        <div className="text-center"><Spin /></div>
                    ) : courses && courses.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={courses}
                            renderItem={(item) => (
                                <List.Item actions={[<a key="edit">Редагувати</a>]}>
                                    <List.Item.Meta
                                        avatar={<BookOutlined className="text-xl text-blue-500" />}
                                        title={<a href={`/dashboard/courses/${item.id}`}>{item.title}</a>}
                                        description={item.description}
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Empty description="Ви ще не створили жодного курсу" />
                    )}
                </Card>
            </div>

            <CreateCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}