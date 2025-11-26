"use client";

import React, { useState } from "react";
import { Card, Avatar, Form, Input, Button, Table, Row, Col, message, Spin, Progress, Tooltip } from "antd";
import { UserOutlined, EditOutlined, SaveOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useUpdateProfileMutation } from "@/lib/store/features/auth/authApi";
import { useGetMyGradesQuery, CourseGrade, GradeAssignment } from "@/lib/store/features/grades/gradesApi";
import { setCredentials } from "@/lib/store/features/auth/authSlice";
import Link from "next/link";

export default function ProfilePage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const { data: grades, isLoading: loadingGrades } = useGetMyGradesQuery();

    const [isEditing, setIsEditing] = useState(false);

    const onFinish = async (values: { full_name: string }) => {
        try {
            const updatedUser = await updateProfile(values).unwrap();
            dispatch(setCredentials(updatedUser));
            message.success("Профіль оновлено");
            setIsEditing(false);
            window.location.reload();
        } catch (e) {
            message.error("Помилка");
        }
    };

    // Main table
    const courseColumns = [
        {
            title: 'Назва Курсу',
            dataIndex: 'course_title',
            key: 'course_title',
            render: (text: string, record: CourseGrade) => (
                <Link href={`/dashboard/courses/${record.course_id}`} className="text-blue-600 font-bold hover:underline">
                    {text}
                </Link>
            )
        },
        {
            title: 'Прогрес',
            key: 'progress',
            width: 300,
            render: (_: any, record: CourseGrade) => {
                const percent = Math.round((record.total_grade / record.total_max_grade) * 100) || 0;
                return <Progress percent={percent} size="small" status={percent >= 60 ? "active" : "exception"} />;
            }
        },
        {
            title: 'Підсумкова оцінка',
            key: 'total',
            align: 'right' as const,
            render: (_: any, record: CourseGrade) => (
                <span className="font-bold text-lg">
                    {record.total_grade} <span className="text-gray-400 text-sm">/ {record.total_max_grade}</span>
                </span>
            )
        },
    ];

    // Expanded table
    const expandedRowRender = (record: CourseGrade) => {
        const assignmentColumns = [
            { title: 'Лабораторна робота', dataIndex: 'title', key: 'title' },
            {
                title: 'Коментар викладача',
                dataIndex: 'teacher_comment',
                key: 'comment',
                render: (text: string) => text ? <Tooltip title={text}><InfoCircleOutlined className="text-blue-500" /></Tooltip> : '-'
            },
            {
                title: 'Оцінка',
                dataIndex: 'grade',
                key: 'grade',
                align: 'right' as const,
                render: (grade: number | null, item: GradeAssignment) => {
                    let color = "text-gray-400";
                    if (grade !== null) {
                        if (grade >= item.max_grade * 0.9) color = "text-green-600 font-bold";
                        else if (grade >= item.max_grade * 0.6) color = "text-blue-600";
                        else color = "text-red-500";
                    }
                    return (
                        <span className={color}>
                            {grade !== null ? `${grade} / ${item.max_grade}` : "Не оцінено"}
                        </span>
                    );
                }
            },
        ];

        return (
            <Table
                columns={assignmentColumns}
                dataSource={record.assignments}
                pagination={false}
                rowKey="assignment_id"
                size="small"
                bordered
            />
        );
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex gap-6 mb-8">
                <Card className="w-1/3 text-center">
                    <Avatar size={100} icon={<UserOutlined />} src={user?.avatar_url} className="mb-4 bg-blue-100 text-blue-500" />
                    <h2 className="text-xl font-bold">{user?.full_name}</h2>
                    <p className="text-gray-500 uppercase text-xs">{user?.role}</p>
                    <Button icon={<EditOutlined />} onClick={() => setIsEditing(!isEditing)} className="mt-4">Редагувати</Button>
                </Card>

                <Card className="w-2/3" title="Редагування інформації">
                    {isEditing ? (
                        <Form layout="vertical" initialValues={{ full_name: user?.full_name }} onFinish={onFinish}>
                            <Form.Item name="full_name" label="ПІБ"><Input /></Form.Item>
                            <Button type="primary" htmlType="submit" loading={isUpdating}>Зберегти</Button>
                        </Form>
                    ) : (
                        <div className="text-gray-500 flex items-center justify-center h-full">Натисніть "Редагувати", щоб змінити дані</div>
                    )}
                </Card>
            </div>

            <Card title="Журнал успішності" className="shadow-sm">
                {user?.role === 'student' ? (
                    <Table
                        className="components-table-demo-nested"
                        columns={courseColumns}
                        expandable={{ expandedRowRender, defaultExpandAllRows: true }}
                        dataSource={grades}
                        loading={loadingGrades}
                        rowKey="course_id"
                        pagination={false}
                    />
                ) : (
                    <div className="text-center text-gray-500 py-10">Журнал оцінок доступний тільки для студентів.</div>
                )}
            </Card>
        </div>
    );
}