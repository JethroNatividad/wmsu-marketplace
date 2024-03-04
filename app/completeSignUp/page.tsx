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
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

type Inputs = {
  firstName: string;
  MiddleName: string;
  lastName: string;
  department: string;
  preferredCampus?: string;
  profilePicture?: string;
  bio?: string;
};

type ErrorOptionTypes = LiteralUnion<keyof RegisterOptions, string>;

type ErrorMessages = {
  [K in keyof Inputs]: {
    [T in ErrorOptionTypes]?: string;
  };
};

const errorMessages: ErrorMessages = {
  firstName: {
    required: "First Name is required",
  },
  MiddleName: {
    required: "Middle Name is required",
  },
  lastName: {
    required: "Last Name is required",
  },
  department: {
    required: "Department is required",
  },
};

const CompleteSignUp = () => {
  const [user, loadingUser, errorUser] = useAuthState(auth);

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (errorUser) {
    return <div>Error: {errorUser?.message}</div>;
  }

  if (!user) {
    return <div>Error: User not found</div>;
  }

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({}) => {
    try {
      //   await createUserWithEmailAndPassword(auth, email, password);
      //   // Redirect to verify email
      //   return router.push("/verifyEmail");
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

        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true })}
        />

        {errors.password && (
          <p>{errorMessages.password[errors.password?.type]}</p>
        )}

        {errors.root?.type == "server" && <p>{errors.root.message}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default CompleteSignUp;
