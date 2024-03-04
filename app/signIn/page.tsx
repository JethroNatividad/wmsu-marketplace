// pages/SignIn.tsx
import React from "react";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { auth } from "../../firebase";
import { sendSignInLinkToEmail } from "firebase/auth";

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
    pattern: "Email must be @wmsu.edu.ph",
  },
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    const actionCodeSettings = {
      url: "http://localhost:3000/authRedirect",
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
    } catch (error) {
      console.error("Error sending sign-in link:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Enter university email"
          {...register("email", {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@wmsu\.edu\.ph$/,
          })}
        />
        {errors.email && <p>{errorMessages.email[errors.email?.type]}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default SignIn;
