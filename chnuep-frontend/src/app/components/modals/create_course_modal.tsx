"use client";

import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCreateCourseMutation } from "@/lib/store/features/courses/coursesApi";

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose }) => {
    const [createCourse, { isLoading }] = useCreateCourseMutation();

    const validationSchema = Yup.object({
        title: Yup.string().required("Введіть назву курсу"),
        description: Yup.string().required("Введіть опис курсу"),
    });

    const handleSubmit = async (values: { title: string; description: string }, { resetForm }: any) => {
        console.log("SUBMITTING FORM...", values);
        try {
            await createCourse(values).unwrap();
            message.success("Курс успішно створено!");
            resetForm();
            onClose();
        } catch (error) {
            console.error(error);
            message.error("Не вдалося створити курс");
        }
    };

    return (
        <Modal
            title="Створити новий курс"
            open={isOpen}
            onCancel={onClose}
            footer={null}
        >
            <Formik
                initialValues={{ title: "", description: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, submitForm }) => (
                    <Form layout="vertical">
                        <Form.Item
                            label="Назва предмету"
                            validateStatus={touched.title && errors.title ? "error" : ""}
                            help={touched.title && errors.title ? errors.title : ""}
                        >
                            <Input
                                name="title"
                                placeholder="напр. Вища Математика"
                                value={values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Опис"
                            validateStatus={touched.description && errors.description ? "error" : ""}
                            help={touched.description && errors.description ? errors.description : ""}
                        >
                            <Input.TextArea
                                rows={4}
                                name="description"
                                placeholder="Короткий опис курсу..."
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="button"
                            onClick={() => submitForm()}
                            loading={isLoading}
                            block
                        >
                            Створити
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default CreateCourseModal;