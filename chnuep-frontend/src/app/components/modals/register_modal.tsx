"use client";

import React from "react";
import { Modal, Form, Input, Button, message, Select } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { RegisterModalProps, RegisterValues } from "@/app/types/RegisterTypes";
import { useRegisterMutation } from "@/lib/store/features/auth/authApi";

interface ExtendedRegisterValues extends RegisterValues {
    full_name: string;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isRegisterModalOpened, setIsRegisterModalOpened }) => {
    const [register, { isLoading }] = useRegisterMutation();

    const validationSchema = Yup.object({
        email: Yup.string().email("Некоректна пошта").required("Обов'язкове поле"),
        full_name: Yup.string().min(2, "Занадто коротке ім'я").required("Обов'язкове поле"),
        password: Yup.string().min(6, "Мінімум 6 символів").required("Обов'язкове поле"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Паролі не співпадають")
            .required("Підтвердження обов'язкове"),
    });

    const handleSubmit = async (values: ExtendedRegisterValues, { setSubmitting }: any) => {
        try {
            await register(values).unwrap();

            message.success("Реєстрація успішна! Тепер увійдіть у систему.");
            setIsRegisterModalOpened(false);
        } catch (err: any) {
            message.error(err?.data?.detail || "Помилка реєстрації");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Реєстрація"
            open={isRegisterModalOpened}
            onCancel={() => setIsRegisterModalOpened(false)}
            footer={null}
        >
            <Formik
                initialValues={{ email: "", full_name: "", password: "", confirmPassword: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Email"
                            validateStatus={touched.email && errors.email ? "error" : ""}
                            help={touched.email && errors.email ? errors.email : ""}
                        >
                            <Input name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
                        </Form.Item>

                        <Form.Item
                            label="ПІБ (Повне ім'я)"
                            validateStatus={touched.full_name && errors.full_name ? "error" : ""}
                            help={touched.full_name && errors.full_name ? errors.full_name : ""}
                        >
                            <Input name="full_name" placeholder="Іванов Іван Іванович" value={values.full_name} onChange={handleChange} onBlur={handleBlur} />
                        </Form.Item>

                        <Form.Item
                            label="Пароль"
                            validateStatus={touched.password && errors.password ? "error" : ""}
                            help={touched.password && errors.password ? errors.password : ""}
                        >
                            <Input.Password name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
                        </Form.Item>

                        <Form.Item
                            label="Підтвердження пароля"
                            validateStatus={touched.confirmPassword && errors.confirmPassword ? "error" : ""}
                            help={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""}
                        >
                            <Input.Password name="confirmPassword" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={isLoading} block>
                            Зареєструватися
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default RegisterModal;