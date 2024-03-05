"use client";

import React from "react";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

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

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      setError("root", {
        type: "server",
        message: (error as Error).message,
      });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden md:block w-1/2 h-full">Left</div>
      <div className="w-full md:w-1/2 h-full flex md:items-center justify-center">
        <form
          className="w-full max-w-md px-5 py-10 md:py-0"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              className={`input input-bordered w-full ${
                errors.email && "input-error text-error"
              }`}
              type="text"
              placeholder="eh123456789@wmsu.edu.ph"
              {...register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@wmsu\.edu\.ph$/,
              })}
            />

            <div className="label">
              {errors.email && (
                <span className="label-text-alt text-error">
                  {errorMessages.email[errors.email?.type]}
                </span>
              )}
            </div>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              className={`input input-bordered w-full ${
                errors.password && "input-error text-error"
              }`}
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />

            <div className="label">
              {errors.password && (
                <span className="label-text-alt text-error">
                  {errorMessages.password[errors.password?.type]}
                </span>
              )}
            </div>
          </label>

          {errors.root?.type == "server" && <p>{errors.root.message}</p>}
          <button className="btn btn-primary w-full" type="submit">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
