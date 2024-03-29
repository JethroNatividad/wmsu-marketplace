"use client";

import React, { useEffect, useState } from "react";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateDoc } from "firebase/firestore";
import Image from "next/image";
import authHeroImage from "@/assets/images/auth-hero.png";
import { userRef } from "@/models/User";
import PageLoading from "@/components/PageLoading";
import { useAuth } from "@/store/auth";
import useCampus from "@/hooks/useCampus";
import useCourse from "@/hooks/useCourse";

type Inputs = {
  firstName: string;
  middleName?: string;
  lastName: string;
  course: string;
  preferredCampus: string;
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
  course: {
    required: "Course is required",
  },
  preferredCampus: {
    required: "Preferred Campus is required",
  },
};

const CompleteSignUp = () => {
  const { error, loading, user, userData, setUserData } = useAuth();
  const { campuses, campusesError, campusesLoading } = useCampus();
  const { courses, coursesError, coursesLoading } = useCourse();
  const [sending, setSending] = useState(false);
  const router = useRouter();

  // const courses = ["BSCS", "BSIT", "BSCpE"];

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

  const onSubmit: SubmitHandler<Inputs> = async ({
    course,
    firstName,
    lastName,
    middleName,
    preferredCampus,
  }) => {
    if (user && userData) {
      setSending(true);
      try {
        // Reference the user document in Firestore

        await updateDoc(userRef(user.uid), {
          firstName,
          middleName: middleName || "",
          lastName,
          course,
          preferredCampus: preferredCampus || "",
          completeSignUp: true,
        });

        // Update the user data in the store
        setUserData({
          ...userData,
          firstName,
          middleName: middleName || "",
          lastName,
          course,
          preferredCampus: preferredCampus || "",
          completeSignUp: true,
        });

        setSending(false);
        // Redirect to home page after successful sign-up
        router.push("/");
      } catch (error) {
        setError("root", {
          type: "server",
          message: (error as Error).message,
        });

        setSending(false);
      }
    }
  };

  if (loading || !user?.emailVerified || userData?.completeSignUp) {
    return <PageLoading />;
  }

  return (
    <div className="flex h-screen">
      <div className="hidden lg:block w-1/2 h-full relative overflow-hidden">
        <Image className="object-cover" fill src={authHeroImage} alt="hero" />
      </div>
      <div className="w-full lg:w-1/2 h-full flex lg:items-center justify-center">
        <form
          noValidate
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
              <span className="label-text">Middle Name (Optional)</span>
            </div>
            <input
              className={`input input-bordered w-full`}
              type="text"
              placeholder="Santos"
              {...register("middleName")}
            />

            <div className="label"></div>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Course</span>
            </div>
            <select
              {...register("course", {
                required: true,
              })}
              defaultValue=""
              className={`select select-bordered w-full ${
                errors.course && "select-error text-error"
              }`}
            >
              <option value="" disabled>
                {coursesLoading
                  ? "Loading Courses"
                  : coursesError
                  ? "Error Loading Courses"
                  : "Select Course"}
              </option>
              {courses.map((course) => (
                <option key={course.id} value={course.key}>
                  {course.name}
                </option>
              ))}
            </select>
            <div className="label">
              {errors.course && (
                <span className="label-text-alt text-error">
                  {errorMessages.course[errors.course?.type]}
                </span>
              )}
            </div>
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Preferred Campus</span>
            </div>
            <select
              {...register("preferredCampus", {
                required: true,
              })}
              className={`select select-bordered w-full ${
                errors.preferredCampus && "select-error text-error"
              }`}
              defaultValue=""
            >
              <option value="" disabled>
                {campusesLoading
                  ? "Loading Campuses"
                  : campusesError
                  ? "Error Loading Campuses"
                  : "Select Campus"}
              </option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.key}>
                  {campus.name}
                </option>
              ))}
            </select>
            <div className="label">
              {errors.preferredCampus && (
                <span className="label-text-alt text-error">
                  {errorMessages.preferredCampus[errors.preferredCampus?.type]}
                </span>
              )}
            </div>
          </label>

          {errors.root?.type == "server" && (
            <span className="label-text-alt text-error">
              {errors.root.message}
            </span>
          )}

          <button
            disabled={sending}
            className="btn btn-primary w-full"
            type="submit"
          >
            Continue
            {sending && <span className="loading loading-spinner"></span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteSignUp;
