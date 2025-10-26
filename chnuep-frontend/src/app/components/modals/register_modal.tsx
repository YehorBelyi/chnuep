"use client";

import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { FormikProps } from "formik";
import { RegisterValues, RegisterModalProps } from "@/app/types/RegisterTypes";

const RegisterModal: React.FC<FormikProps<RegisterValues> & RegisterModalProps> = (props) => {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        isRegisterModalOpened,
        setIsRegisterModalOpened,
    } = props;

    const handleCancel = () => {
        setIsRegisterModalOpened(false);
    };

    return (
        <Modal
            title="Sign Up"
            open={isRegisterModalOpened}
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

                <Form.Item
                    label="Confirm Password"
                    validateStatus={touched.confirmPassword && errors.confirmPassword ? "error" : ""}
                    help={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : ""}
                >
                    <Input.Password
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={values.confirmPassword}
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
                    Sign Up
                </Button>
            </Form>
        </Modal>
    );
};

export default RegisterModal;
