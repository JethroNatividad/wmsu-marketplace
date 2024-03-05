"use client";

import React from "react";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { UserData } from "@/models/UserData";
import { doc, setDoc } from "firebase/firestore";

type Inputs = {
  email: string;
  password: string;
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
  password: {
    required: "Password is required",
  },
};

const SignUp = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Store initial user data in Firestore
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        completeSignUp: true,
      } as UserData);
      // Redirect to verify email
      return router.push("/verifyEmail");
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

export default SignUp;
