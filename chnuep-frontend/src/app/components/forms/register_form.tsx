"use client";

import { withFormik } from "formik";
import * as Yup from "yup";
import { RegisterValues, RegisterModalProps } from "@/app/types/RegisterTypes";
import RegisterModal from "../modals/register_modal";

const RegisterFormProcessing = withFormik<RegisterModalProps, RegisterValues>({
    mapPropsToValues: () => ({
        email: "",
        password: "",
        confirmPassword: "",
    }),

    validationSchema: Yup.object({
        email: Yup.string()
            .email("Некоректна електронна адреса")
            .required("Поле є обов'язковим"),
        password: Yup.string()
            .min(6, "Мінімум 6 символів")
            .required("Поле є обов'язковим"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Паролі не співпадають")
            .required("Підтвердження пароля є обов’язковим"),
    }),

    handleSubmit: (values, { setSubmitting, props }) => {
        setTimeout(() => {
            alert(`Реєстрація виконана:\n${JSON.stringify(values, null, 2)}`);
            props.setIsRegisterModalOpened(false);
            setSubmitting(false);
        }, 1000);
    },

    displayName: "RegisterModalForm",
})(RegisterModal);

export default RegisterFormProcessing;
