"use client";

import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Popconfirm, Tooltip, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import {
    useGetMyCoursesQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    Course
} from '@/lib/store/features/courses/coursesApi';
import Link from 'next/link';

const { Title } = Typography;

export default function ManageCoursesPage() {
    // API Hooks
    const { data: courses, isLoading } = useGetMyCoursesQuery();
    const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
    const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
    const [deleteCourse] = useDeleteCourseMutation();

    // Local State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [form] = Form.useForm();

    // Handlers
    const handleOpenCreate = () => {
        setEditingCourse(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleOpenEdit = (course: Course) => {
        setEditingCourse(course);
        form.setFieldsValue({
            title: course.title,
            description: course.description
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCourse(id).unwrap();
            message.success('Курс видалено');
        } catch (error) {
            message.error('Не вдалося видалити курс');
        }
    };

    const handleFinish = async (values: { title: string; description: string }) => {
        try {
            if (editingCourse) {
                await updateCourse({ id: editingCourse.id, data: values }).unwrap();
                message.success('Курс оновлено');
            } else {
                await createCourse(values).unwrap();
                message.success('Курс створено');
            }
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            message.error('Сталася помилка');
        }
    };

    // Table Columns
    const columns = [
        {
            title: 'Назва курсу',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: Course) => (
                <Link href={`/dashboard/courses/${record.id}`} className="font-medium text-blue-600 hover:underline">
                    {text}
                </Link>
            )
        },
        {
            title: 'Опис',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Дії',
            key: 'actions',
            width: 150,
            render: (_: any, record: Course) => (
                <Space>
                    <Tooltip title="Переглянути">
                        <Link href={`/dashboard/courses/${record.id}`}>
                            <Button icon={<EyeOutlined />} size="small" />
                        </Link>
                    </Tooltip>

                    <Tooltip title="Редагувати">
                        <Button
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleOpenEdit(record)}
                        />
                    </Tooltip>

                    <Tooltip title="Видалити">
                        <Popconfirm
                            title="Видалити цей курс?"
                            description="Всі матеріали та оцінки будуть втрачені."
                            onConfirm={() => handleDelete(record.id)}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <Button danger icon={<DeleteOutlined />} size="small" />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Title level={2} style={{ margin: 0 }}>Керування курсами</Title>
                    <p className="text-gray-500">Створюйте нові дисципліни або редагуйте існуючі.</p>
                </div>
                <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleOpenCreate}>
                    Створити курс
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={courses}
                rowKey="id"
                loading={isLoading}
                bordered
                pagination={{ pageSize: 8 }}
            />

            {/* Create / Edit Modal */}
            <Modal
                title={editingCourse ? "Редагувати курс" : "Створити новий курс"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFinish}
                >
                    <Form.Item
                        name="title"
                        label="Назва курсу"
                        rules={[{ required: true, message: 'Будь ласка, введіть назву' }]}
                    >
                        <Input placeholder="Наприклад: Основи програмування" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Опис"
                        rules={[{ required: true, message: 'Будь ласка, введіть опис' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Про що цей курс..." />
                    </Form.Item>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button onClick={() => setIsModalOpen(false)}>Скасувати</Button>
                        <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                            {editingCourse ? "Зберегти зміни" : "Створити"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}