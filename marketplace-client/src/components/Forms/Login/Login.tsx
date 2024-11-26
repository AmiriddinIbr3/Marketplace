"use client";
import AuthService from "@/services/RestAPI/requests/authService";
import { ILoginUser } from "@/types/forms/ILogin";
import { AxiosError } from "axios";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import ErrorWrapper from "../ErrorWrapper/ErrorWrapper";
import BtnsColour from "@/components/BtnsColour/BtnsColour";
import { emailProto, passwordProto, usernameProto } from "../InputProtos";
import { useState } from "react";
import emailIcon from "./Img/gmail.png";
import userIcon from "./Img/user.png";
import phoneIcon from './Img/phone.png';
import "./Login.css";
import Image from "next/image";
import { saveAccessToken } from "@/helpers/tokenHelper";
import { store } from "@/redux";
import { setUser } from "@/redux/userSlice";
import usePhoneInfo from "@/hooks/usePhoneInfo";
import PhoneInput from "react-phone-input-2";

type InputType = "email" | "username" | "phone";

export default function Login() {
    const { phoneInfo, handlePhoneChange } = usePhoneInfo();
    const [inputType, setInputType] = useState<InputType>("username");

    const {
        register,
        handleSubmit,
        clearErrors,
        reset,
        setError,
        formState
    } = useForm<ILoginUser>({
        mode: "onChange",
    });

    const submit: SubmitHandler<ILoginUser> = async data => {
        const { email, password, username } = data;
        const formattedPhone = phoneInfo.phone ? `+${phoneInfo.phone}` : "";
        const countryCode = phoneInfo.countryCode;
        
        if(!username && !email && (!formattedPhone || !countryCode)) {
            setError('email', {
                type: 'manual',
                message: 'Email, username or phone is required'
            });
            setError('username', {
                type: 'manual',
                message: 'Email, username or phone is required'
            });
            return;
        }

        AuthService.login(password, email, username, formattedPhone, countryCode)
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
    }

    const error: SubmitErrorHandler<ILoginUser> = error => {
        console.log(error);
    }

    const usernameError = formState.errors.username?.message;
    const emailError = formState.errors.email?.message;
    const passwordError = formState.errors.password?.message;

    return (
        <form className="login-form" onSubmit={handleSubmit(submit, error)}>
            {inputType === "email" ? (
                <ErrorWrapper
                    errorMessage={emailError}
                    icon={
                        <Image
                            className="image-wrapper"
                            src={emailIcon}
                            alt=""
                            width={40}
                            height={40}
                            onClick={() => setInputType("username")}
                        />
                    }
                    className="grid-container"
                >
                    <input
                        type="email"
                        placeholder="Enter email"
                        {...register('email', {
                            ...emailProto,
                            required: false,
                        })}
                    />
                </ErrorWrapper>
            ) : inputType === "username" ? (
                <ErrorWrapper
                    errorMessage={usernameError}
                    icon={
                        <Image
                            src={userIcon}
                            alt=""
                            width={40}
                            height={40}
                            onClick={() => setInputType("phone")}
                        />
                    }
                    className="grid-container"
                >
                    <input
                        type="text"
                        placeholder="Enter username"
                        {...register('username', {
                            ...usernameProto,
                            required: false,
                        })}
                    />
                </ErrorWrapper>
            ) : inputType === "phone" ? (
                <ErrorWrapper
                    icon={
                        <Image
                            src={phoneIcon}
                            alt=""
                            width={40}
                            height={40}
                            onClick={() => setInputType("email")}
                        />
                    }
                    className="grid-container"
                >
                    <PhoneInput
                        value={phoneInfo.phone}
                        onChange={handlePhoneChange}
                        inputProps={{
                            name: 'phone',
                            required: false,
                            autoFocus: false,
                        }}
                    />
                </ErrorWrapper>
            ) : null}

            <ErrorWrapper errorMessage={passwordError}>
                <input
                    type="password"
                    placeholder="Enter password"
                    {...register('password', passwordProto)}
                />
            </ErrorWrapper>

            <BtnsColour className="btns-wrapper">
                <button type="submit">Send form</button>
                <button type="button" onClick={() => {
                    clearErrors()
                    reset()
                }}>
                    Reset form
                </button>
            </BtnsColour>
        </form>
    );
}