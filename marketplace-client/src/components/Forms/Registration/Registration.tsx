"use client";
import AuthService from "@/services/RestAPI/requests/authService";
import { IRegistrationUser } from "@/types/forms/IRegistration";
import { AxiosError } from "axios";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import BtnsColour from "@/components/BtnsColour/BtnsColour";
import ErrorWrapper from "../ErrorWrapper/ErrorWrapper";
import './Registration.css';
import { emailProto, nameProto, passwordProto, surnameProto, usernameProto } from "../InputProtos";
import PhoneInput from 'react-phone-input-2';
import { saveAccessToken } from "@/helpers/tokenHelper";
import { store } from "@/redux";
import { setUser } from "@/redux/userSlice";
import usePhoneInfo from "@/hooks/usePhoneInfo";

export default function Registration() {
    const { phoneInfo, handlePhoneChange } = usePhoneInfo();

    const {
        register,
        handleSubmit,
        clearErrors,
        reset,
        formState,
    } = useForm<IRegistrationUser>({
        mode: "onChange",
    });

    const submit: SubmitHandler<IRegistrationUser> = data => {
        const { email, name, password, username, surname } = data;
        const formattedPhone = `+${phoneInfo.phone}`;
        const countryCode = phoneInfo.countryCode;

        AuthService.registration(name, username, email, password, formattedPhone, countryCode, surname)
            .then(response => {
                saveAccessToken(response.data.accessToken);
                store.dispatch(setUser(response.data.user));
            })
            .catch(err => {
                if (err instanceof AxiosError && err.response) {
                    const serverErrors = err.response.data;
                    console.log(serverErrors);
                }
            });
    };

    const error: SubmitErrorHandler<IRegistrationUser> = error => {
        console.log(error);
    };

    const emailError = formState.errors.email?.message;
    const nameError = formState.errors.name?.message;
    const usernameError = formState.errors.username?.message;
    const surnameError = formState.errors.surname?.message;
    const passwordError = formState.errors.password?.message;

    return (
        <form className="registration-form" onSubmit={handleSubmit(submit, error)}>
            <ErrorWrapper errorMessage={nameError}>
                <input type="text" placeholder="Enter name" {...register('name', nameProto)} />
            </ErrorWrapper>

            <ErrorWrapper errorMessage={surnameError} noticeMessage="Surname is an optional field">
                <input type="text" placeholder="Enter surname" {...register('surname', surnameProto)} />
            </ErrorWrapper>

            <ErrorWrapper errorMessage={usernameError}>
                <input type="text" placeholder="Enter username" {...register('username', usernameProto)} />
            </ErrorWrapper>

            <ErrorWrapper errorMessage={emailError}>
                <input type="email" placeholder="Enter email" {...register('email', emailProto)} />
            </ErrorWrapper>

            <ErrorWrapper>
                <PhoneInput
                    value={phoneInfo.phone}
                    onChange={handlePhoneChange}
                    inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: false,
                    }}
                />
            </ErrorWrapper>

            <ErrorWrapper errorMessage={passwordError}>
                <input type="password" placeholder="Enter password" {...register('password', passwordProto)} />
            </ErrorWrapper>

            <BtnsColour className="btns-wrapper">
                <button type="submit">Send form</button>
                <button type="button" onClick={() => {
                    clearErrors();
                    reset();
                }}>
                    Reset form
                </button>
            </BtnsColour>
        </form>
    );
}