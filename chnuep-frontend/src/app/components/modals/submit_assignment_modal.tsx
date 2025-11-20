"use client";

import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSubmitAssignmentMutation } from "@/lib/store/features/courses/coursesApi";

interface SubmitAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    assignmentId: number;
}

const SubmitAssignmentModal: React.FC<SubmitAssignmentModalProps> = ({ isOpen, onClose, assignmentId }) => {
    const [submitAssignment, { isLoading }] = useSubmitAssignmentMutation();
    const [file, setFile] = useState<File | null>(null);
    const [comment, setComment] = useState("");

    const handleSubmit = async () => {
        if (!file) {
            message.error("Будь ласка, оберіть файл");
            return;
        }

        try {
            await submitAssignment({
                assignmentId,
                file,
                comment
            }).unwrap();

            message.success("Роботу здано!");
            setFile(null);
            setComment("");
            onClose();
        } catch (error: any) {
            console.error(error);
            message.error(error?.data?.detail || "Помилка при здачі");
        }
    };

    return (
        <Modal
            title="Здати лабораторну роботу"
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <Form layout="vertical">
                <Form.Item label="Файл роботи" required>
                    <Upload
                        beforeUpload={(f) => {
                            setFile(f);
                            return false; // Prevents auto upload
                        }}
                        maxCount={1}
                        onRemove={() => setFile(null)}
                    >
                        <Button icon={<UploadOutlined />}>Обрати файл</Button>
                    </Upload>
                </Form.Item>

                <Form.Item label="Коментар викладачу">
                    <Input.TextArea
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </Form.Item>

                <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={isLoading}
                    block
                    disabled={!file}
                >
                    Відправити на перевірку
                </Button>
            </Form>
        </Modal>
    );
};

export default SubmitAssignmentModal;