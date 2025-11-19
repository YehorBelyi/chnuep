"use client";

import React from "react";
import { Modal, Form, Input, Button, message, InputNumber, DatePicker } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCreateAssignmentMutation } from "@/lib/store/features/courses/coursesApi";
import dayjs from 'dayjs';

interface CreateAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseId: number;
}

const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({ isOpen, onClose, courseId }) => {
    const [createAssignment, { isLoading }] = useCreateAssignmentMutation();

    const validationSchema = Yup.object({
        title: Yup.string().required("Введіть назву завдання"),
        description: Yup.string().required("Введіть опис завдання"),
        max_grade: Yup.number().min(1).max(100).required("Вкажіть максимальний бал"),
        due_date: Yup.mixed().required("Вкажіть дату здачі"), // Yup не дуже добре працює з об'єктами Dayjs, тому mixed
    });

    const handleSubmit = async (values: any, { resetForm }: any) => {
        try {
            await createAssignment({
                ...values,
                course_id: courseId,
                // Конвертуємо dayjs об'єкт у ISO рядок для бекенду
                due_date: values.due_date ? values.due_date.toISOString() : null
            }).unwrap();

            message.success("Завдання успішно створено!");
            resetForm();
            onClose();
        } catch (error) {
            console.error(error);
            message.error("Не вдалося створити завдання");
        }
    };

    return (
        <Modal
            title="Додати лабораторну роботу"
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <Formik
                initialValues={{ title: "", description: "", max_grade: 100, due_date: null }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue, submitForm }) => (
                    <Form layout="vertical">
                        <Form.Item
                            label="Назва роботи"
                            validateStatus={touched.title && errors.title ? "error" : ""}
                            help={touched.title && errors.title ? errors.title as string : ""}
                        >
                            <Input name="title" value={values.title} onChange={handleChange} onBlur={handleBlur} />
                        </Form.Item>

                        <Form.Item
                            label="Опис / Завдання"
                            validateStatus={touched.description && errors.description ? "error" : ""}
                            help={touched.description && errors.description ? errors.description as string : ""}
                        >
                            <Input.TextArea rows={4} name="description" value={values.description} onChange={handleChange} onBlur={handleBlur} />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item label="Макс. бал">
                                <InputNumber
                                    min={1}
                                    max={100}
                                    value={values.max_grade}
                                    onChange={(val) => setFieldValue("max_grade", val)}
                                    className="w-full"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Дедлайн"
                                validateStatus={touched.due_date && errors.due_date ? "error" : ""}
                                help={touched.due_date && errors.due_date ? "Оберіть дату" : ""}
                            >
                                <DatePicker
                                    className="w-full"
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    // AntD DatePicker працює з dayjs, Formik хоче значення
                                    value={values.due_date}
                                    onChange={(date) => setFieldValue("due_date", date)}
                                />
                            </Form.Item>
                        </div>

                        <Button
                            type="primary"
                            htmlType="button" // Важливо: button, щоб уникнути конфлікту
                            onClick={() => submitForm()}
                            loading={isLoading}
                            block
                        >
                            Створити завдання
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default CreateAssignmentModal;