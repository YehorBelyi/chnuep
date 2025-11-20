"use client";

import React, { useState } from "react";
import { Modal, Table, Button, InputNumber, Input, Tag, message, Space, Avatar } from "antd";
import { DownloadOutlined, UserOutlined, SaveOutlined } from "@ant-design/icons";
import { useGetSubmissionsForAssignmentQuery, useGradeSubmissionMutation, Submission } from "@/lib/store/features/courses/coursesApi";

interface TeacherGradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignmentId: number;
    assignmentTitle: string;
}

const TeacherGradingModal: React.FC<TeacherGradingModalProps> = ({ isOpen, onClose, assignmentId, assignmentTitle }) => {
    // Getting all submissions from database
    const { data: submissions, isLoading } = useGetSubmissionsForAssignmentQuery(assignmentId, {
        skip: !isOpen, // Don't do request to backend if modal is not opened
    });

    const [gradeSubmission] = useGradeSubmissionMutation();

    const [editingValues, setEditingValues] = useState<Record<number, { grade: number; comment: string }>>({});

    const handleSave = async (submissionId: number) => {
        const values = editingValues[submissionId];
        if (!values) return;

        try {
            await gradeSubmission({
                id: submissionId,
                grade: values.grade,
                comment: values.comment
            }).unwrap();
            message.success("Оцінку збережено");

            const newValues = { ...editingValues };
            delete newValues[submissionId];
            setEditingValues(newValues);
        } catch (e) {
            message.error("Помилка збереження");
        }
    };

    const columns = [
        {
            title: 'Студент',
            key: 'student',
            render: (_: any, record: Submission) => (
                <Space>
                    <Avatar src={record.student?.avatar_url} icon={<UserOutlined />} />
                    <div className="flex flex-col">
                        <span className="font-medium">{record.student?.full_name}</span>
                        <span className="text-xs text-gray-500">{new Date(record.submitted_at).toLocaleString()}</span>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Файл',
            key: 'file',
            render: (_: any, record: Submission) => (
                <Button
                    icon={<DownloadOutlined />}
                    href={`http://localhost:8000${record.file_url}`}
                    target="_blank"
                    size="small"
                >
                    Завантажити
                </Button>
            ),
        },
        {
            title: 'Оцінка (Макс. 100)',
            key: 'grade',
            width: 300,
            render: (_: any, record: Submission) => {
                const isEditing = editingValues[record.id] !== undefined;
                const currentGrade = isEditing ? editingValues[record.id].grade : record.grade;
                const currentComment = isEditing ? editingValues[record.id].comment : record.teacher_comment;

                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <InputNumber
                                min={0} max={100}
                                value={currentGrade}
                                onChange={(val) => setEditingValues({
                                    ...editingValues,
                                    [record.id]: { ...editingValues[record.id], grade: val || 0, comment: currentComment || "" }
                                })}
                                placeholder="Бал"
                            />
                            <Button
                                type={isEditing ? "primary" : "default"}
                                icon={<SaveOutlined />}
                                onClick={() => handleSave(record.id)}
                                disabled={!isEditing}
                            >
                                {isEditing ? "Зберегти" : "Оцінено"}
                            </Button>
                        </div>
                        <Input.TextArea
                            placeholder="Коментар викладача..."
                            rows={1}
                            value={currentComment || ""}
                            onChange={(e) => setEditingValues({
                                ...editingValues,
                                [record.id]: { ...editingValues[record.id], grade: currentGrade || 0, comment: e.target.value }
                            })}
                        />
                    </div>
                );
            }
        }
    ];

    return (
        <Modal
            title={`Перевірка робіт: ${assignmentTitle}`}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Table
                dataSource={submissions}
                columns={columns}
                rowKey="id"
                loading={isLoading}
                pagination={false}
                locale={{ emptyText: "Ще ніхто не здав цю роботу" }}
            />
        </Modal>
    );
};

export default TeacherGradingModal;