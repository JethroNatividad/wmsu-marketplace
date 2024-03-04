"use client";
// pages/SignIn.tsx
import React from "react";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { auth } from "../../firebase";
import { AuthError, sendSignInLinkToEmail } from "firebase/auth";

type Inputs = {
  email: string;
};

type ErrorOptionTypes = LiteralUnion<keyof RegisterOptions, string>;

type ErrorMessages = {
  [K in keyof Inputs]: {
    [T in ErrorOptionTypes]?: string;
  };
};

const errorMessages: ErrorMessages = {
  email: {
    required: "Email is required",
    pattern: "Email must end in @wmsu.edu.ph",
  },
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/authRedirect`,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
    } catch (error) {
      setError("root", {
        type: "server",
        message: (error as Error).message,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="eh123456789@wmsu.edu.ph"
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@wmsu\.edu\.ph$/,
          })}
        />
        {errors.email && <p>{errorMessages.email[errors.email?.type]}</p>}
        {errors.root?.type == "server" && <p>{errors.root.message}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default SignIn;
