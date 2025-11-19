"use client";

import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { LoginModalProps, LoginValues } from "@/app/types/LoginTypes";
import { useLoginMutation } from "@/lib/store/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/store/features/auth/authSlice";
import { useRouter } from "next/navigation";

const LoginModal: React.FC<LoginModalProps> = ({ isLoginModalOpened, setIsLoginModalOpened }) => {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const router = useRouter();

    const validationSchema = Yup.object({
        email: Yup.string().email("Некоректна пошта").required("Обов'язкове поле"),
        password: Yup.string().min(6).required("Обов'язкове поле"),
    });

    const handleSubmit = async (values: LoginValues) => {
        try {
            const userData = await login(values).unwrap();
            dispatch(setCredentials(userData.user));
            message.success("Вітаємо в системі!");
            setIsLoginModalOpened(false);
            router.push("/dashboard");

        } catch (err: any) {
            message.error(err?.data?.detail || "Помилка входу");
        }
    };

    return (
        <Modal
            title="Вхід у систему"
            open={isLoginModalOpened}
            onCancel={() => setIsLoginModalOpened(false)}
            footer={null}
        >
            <Formik
                initialValues={{ email: "", password: "" }}
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
                            label="Password"
                            validateStatus={touched.password && errors.password ? "error" : ""}
                            help={touched.password && errors.password ? errors.password : ""}
                        >
                            <Input.Password name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={isLoading} block>
                            Увійти
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default LoginModal;