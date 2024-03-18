"use client";

import React, { useState } from "react";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { userRef } from "@/models/User";
import { setDoc } from "firebase/firestore";
import Image from "next/image";
import authHeroImage from "@/assets/images/auth-hero.png";
import Link from "next/link";

type Inputs = {
  email: string;
  password: string;
  repeatPassword: string;
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
  repeatPassword: {
    required: "Repeat Password is required",
    match: "Passwords do not match",
  },
};

const SignUp = () => {
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({
    email,
    password,
    repeatPassword,
  }) => {
    if (password !== repeatPassword) {
      return setError("repeatPassword", {
        type: "match",
      });
    }
    setSending(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Store initial user data in Firestore
      await setDoc(userRef(user.uid), {
        email: user.email || "",
        completeSignUp: false,
        course: "",
        firstName: "",
        lastName: "",
        middleName: "",
        preferredCampus: "",
      });

      setSending(false);
      // Redirect to verify email
      return router.push("/verifyEmail");
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
          <h1 className="text-4xl font-bold mb-5">Sign Up</h1>
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

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Repeat Password</span>
            </div>
            <input
              className={`input input-bordered w-full ${
                errors.repeatPassword && "input-error text-error"
              }`}
              type="password"
              placeholder="Password"
              {...register("repeatPassword", { required: true })}
            />

            <div className="label">
              {errors.repeatPassword && (
                <span className="label-text-alt text-error">
                  {errorMessages.repeatPassword[errors.repeatPassword?.type]}
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
            Create account
            {sending && <span className="loading loading-spinner"></span>}
          </button>

          <p className="text-sm mt-2">
            Already have an account?{" "}
            <Link className="text-primary" href="/signIn">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
