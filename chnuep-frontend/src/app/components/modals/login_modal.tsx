"use client";

import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { FormikProps } from "formik";
import { LoginValues, LoginModalProps } from "@/app/types/LoginTypes";

const LoginModal: React.FC<FormikProps<LoginValues> & LoginModalProps> = (props) => {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        isLoginModalOpened,
        setIsLoginModalOpened,
    } = props;

    const handleCancel = () => setIsLoginModalOpened(false);

    return (
        <Modal
            title="Sign In"
            open={isLoginModalOpened}
            onCancel={handleCancel}
            footer={null}
        >
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Email"
                    validateStatus={touched.email && errors.email ? "error" : ""}
                    help={touched.email && errors.email ? errors.email : ""}
                >
                    <Input
                        name="email"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    validateStatus={touched.password && errors.password ? "error" : ""}
                    help={touched.password && errors.password ? errors.password : ""}
                >
                    <Input.Password
                        name="password"
                        placeholder="Enter your password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    block
                >
                    Sign In
                </Button>
            </Form>
        </Modal>
    );
};

export default LoginModal;
