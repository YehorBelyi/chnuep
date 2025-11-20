"use client";

import React, { useState } from "react";
import { Modal, Select, Button, List, Avatar, message, Popconfirm } from "antd";
import { UserOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
    useAdminEnrollStudentMutation,
    useGetCourseStudentsQuery,
    useGetAllStudentsQuery
} from "@/lib/store/features/courses/coursesApi";
import { User } from "@/lib/store/features/auth/authSlice";

interface AdminEnrollmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: number;
}

const AdminEnrollmentModal: React.FC<AdminEnrollmentModalProps> = ({ isOpen, onClose, courseId }) => {
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

    const { data: enrolledStudents, isLoading: loadingEnrolled } = useGetCourseStudentsQuery(courseId, { skip: !isOpen });
    const { data: allStudents, isLoading: loadingAll } = useGetAllStudentsQuery(undefined, { skip: !isOpen });
    const [enrollStudent, { isLoading: isEnrolling }] = useAdminEnrollStudentMutation();

    const handleEnroll = async () => {
        if (!selectedStudentId) return;
        try {
            await enrollStudent({ studentId: selectedStudentId, courseId }).unwrap();
            message.success("Студента додано до курсу");
            setSelectedStudentId(null);
        } catch (error) {
            message.error("Помилка додавання (можливо, вже записаний)");
        }
    };

    // Show unenrolled students
    const availableStudents = allStudents?.filter(
        s => !enrolledStudents?.some(es => es.id === s.id)
    );

    return (
        <Modal
            title="Керування учасниками курсу"
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            {/* Блок додавання */}
            <div className="flex gap-2 mb-6">
                <Select
                    showSearch
                    placeholder="Оберіть студента"
                    optionFilterProp="children"
                    style={{ width: '100%' }}
                    loading={loadingAll}
                    value={selectedStudentId}
                    onChange={setSelectedStudentId}
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={availableStudents?.map(s => ({
                        value: s.id,
                        label: `${s.full_name} (${s.email})`
                    }))}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleEnroll}
                    loading={isEnrolling}
                    disabled={!selectedStudentId}
                >
                    Додати
                </Button>
            </div>

            <h3 className="text-md font-semibold mb-2">Зараховані студенти ({enrolledStudents?.length || 0})</h3>

            <List
                loading={loadingEnrolled}
                dataSource={enrolledStudents}
                renderItem={(item: User) => (
                    <List.Item
                        actions={[
                            <Popconfirm title="Видалити студента з курсу?" okText="Так" cancelText="Ні" key="delete">
                                <Button type="text" danger icon={<DeleteOutlined />} disabled>Видалити</Button>
                            </Popconfirm>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} src={item.avatar_url} />}
                            title={item.full_name}
                            description={item.email}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default AdminEnrollmentModal;