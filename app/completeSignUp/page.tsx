"use client";

import React, { useEffect } from "react";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import useUserState from "@/hooks/useUserState";
import Image from "next/image";
import authHeroImage from "@/assets/images/auth-hero.png";
import Link from "next/link";

type Inputs = {
  firstName: string;
  middleName?: string;
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
  lastName: {
    required: "Last Name is required",
  },
  department: {
    required: "Department is required",
  },
};

const CompleteSignUp = () => {
  const { user, userData, loading, error } = useUserState();
  const router = useRouter();

  useEffect(() => {
    // - Not logged in ? redirect to /signIn : continue
    // - user not yet verified ? redirect to /verifyEmail: continue
    // - user already completeSignUp ? redirect to / : continue
    if (!loading && !error) {
      if (!user || !userData) {
        return router.push("/signIn");
      }

      if (!user.emailVerified) {
        return router.push("/verifyEmail");
      }

      if (userData.completeSignUp) {
        return router.push("/");
      }
    }
  }, [user, loading, error, userData]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (user) {
      try {
        // Reference the user document in Firestore
        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
          ...data,
          completeSignUp: true,
        });
        // Redirect to home page after successful sign-up
        router.push("/");
      } catch (error) {
        setError("root", {
          type: "server",
          message: (error as Error).message,
        });
      }
    }
  };

  if (loading || !user?.emailVerified || userData?.completeSignUp) {
    return <div>Loading...</div>;
  }

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
          <h1 className="text-4xl font-bold mb-5">Finish Creating Account</h1>

          <div className="sm:flex sm:space-x-5">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                className={`input input-bordered w-full ${
                  errors.firstName && "input-error text-error"
                }`}
                type="text"
                placeholder="Juan"
                {...register("firstName", {
                  required: true,
                })}
              />

              <div className="label">
                {errors.firstName && (
                  <span className="label-text-alt text-error">
                    {errorMessages.firstName[errors.firstName?.type]}
                  </span>
                )}
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Last Name</span>
              </div>
              <input
                className={`input input-bordered w-full ${
                  errors.lastName && "input-error text-error"
                }`}
                type="text"
                placeholder="Cruz"
                {...register("lastName", {
                  required: true,
                })}
              />

              <div className="label">
                {errors.lastName && (
                  <span className="label-text-alt text-error">
                    {errorMessages.lastName[errors.lastName?.type]}
                  </span>
                )}
              </div>
            </label>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Middle Name</span>
            </div>
            <input
              className={`input input-bordered w-full`}
              type="text"
              placeholder="Santos"
              {...register("middleName")}
            />

            <div className="label"></div>
          </label>

          <button className="btn btn-primary w-full" type="submit">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteSignUp;
