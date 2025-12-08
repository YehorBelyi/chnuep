"use client";

import React, { useState, useEffect } from "react";
import { Modal, Table, Button, InputNumber, Input, message, Space, Avatar, Tooltip } from "antd";
import { DownloadOutlined, UserOutlined, SaveOutlined, FileTextOutlined } from "@ant-design/icons";
import { useGetSubmissionsForAssignmentQuery, useGradeSubmissionMutation, Submission } from "@/lib/store/features/courses/coursesApi";

interface TeacherGradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignmentId: number;
    assignmentTitle: string;
}

const TeacherGradingModal: React.FC<TeacherGradingModalProps> = ({ isOpen, onClose, assignmentId, assignmentTitle }) => {
    const { data: submissions, isLoading } = useGetSubmissionsForAssignmentQuery(assignmentId, {
        skip: !isOpen,
    });

    const [gradeSubmission, { isLoading: isSaving }] = useGradeSubmissionMutation();

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

            message.success("Збережено");

            const newValues = { ...editingValues };
            delete newValues[submissionId];
            setEditingValues(newValues);
        } catch (e) {
            message.error("Помилка збереження");
        }
    };

    const updateState = (id: number, field: 'grade' | 'comment', value: any, record: Submission) => {
        setEditingValues(prev => {
            const currentEntry = prev[id] || {
                grade: record.grade || 0,
                comment: record.teacher_comment || ""
            };

            return {
                ...prev,
                [id]: {
                    ...currentEntry,
                    [field]: value
                }
            };
        });
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
            title: 'Оцінювання',
            key: 'grade',
            width: 400,
            render: (_: any, record: Submission) => {
                const isEditing = editingValues[record.id] !== undefined;

                const displayGrade = isEditing ? editingValues[record.id].grade : record.grade;
                const displayComment = isEditing ? editingValues[record.id].comment : record.teacher_comment;

                return (
                    <div className="flex flex-col gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex gap-2 items-center">
                            <span className="text-gray-500 text-sm w-12">Бал:</span>
                            <InputNumber
                                min={0} max={100}
                                value={displayGrade}
                                onChange={(val) => updateState(record.id, 'grade', val, record)}
                                className="w-20"
                            />
                            <Button
                                type={isEditing ? "primary" : "default"}
                                icon={<SaveOutlined />}
                                onClick={() => handleSave(record.id)}
                                disabled={!isEditing}
                                loading={isSaving && isEditing}
                            >
                                {isEditing ? "Зберегти" : "Оцінено"}
                            </Button>
                        </div>

                        <Input.TextArea
                            placeholder="Напишіть коментар до роботи..."
                            rows={2}
                            value={displayComment || ""}
                            onChange={(e) => updateState(record.id, 'comment', e.target.value, record)}
                            style={{ resize: 'none' }}
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
            width={900}
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