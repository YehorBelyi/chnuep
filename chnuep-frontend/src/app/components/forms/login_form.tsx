"use client";

import { withFormik } from "formik";
import * as Yup from "yup";
import { LoginValues, LoginModalProps } from "@/app/types/LoginTypes";
import LoginModal from "../modals/login_modal";

const LoginFormProcessing = withFormik<LoginModalProps, LoginValues>({
    mapPropsToValues: () => ({
        email: "",
        password: "",
    }),

    validationSchema: Yup.object({
        email: Yup.string()
            .email("Некоректна електронна адреса")
            .required("Поле є обов'язковим"),
        password: Yup.string()
            .min(6, "Мінімум 6 символів")
            .required("Поле є обов'язковим"),
    }),

    handleSubmit: (values, { setSubmitting, props }) => {
        setTimeout(() => {
            alert(`Вхід виконано:\n${JSON.stringify(values, null, 2)}`);
            props.setIsLoginModalOpened(false);
            setSubmitting(false);
        }, 1000);
    },

    displayName: "LoginFormProcessing",
})(LoginModal);

export default LoginFormProcessing;
