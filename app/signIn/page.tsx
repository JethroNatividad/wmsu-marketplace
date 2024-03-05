"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import authHeroImage from "@/assets/images/auth-hero.png";

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
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    try {
      setSending(true);
      await signInWithEmailAndPassword(auth, email, password);
      setSending(false);
      router.push("/");
    } catch (error) {
      setError("root", {
        type: "server",
        message: (error as Error).message,
      });
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden lg:block w-1/2 h-full relative overflow-hidden">
        <Image className="object-cover" fill src={authHeroImage} alt="hero" />
      </div>
      <div className="w-full lg:w-1/2 h-full flex lg:items-center justify-center">
        <form
          className="w-full max-w-lg px-5 py-10 lg:py-0"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-4xl font-bold mb-5">Sign In</h1>
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

              {errors.root?.type == "server" && (
                <span className="label-text-alt text-error">
                  {errors.root.message}
                </span>
              )}
            </div>
          </label>

          <button
            className="btn btn-primary w-full"
            disabled={sending}
            type="submit"
          >
            Sign In
            {sending && <span className="loading loading-spinner"></span>}
          </button>

          <p className="text-sm mt-2">
            Don&apos;t have an account?{" "}
            <Link className="text-primary" href="/signUp">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
