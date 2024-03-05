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

type Inputs = {
  firstName: string;
  MiddleName?: string;
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="First Name"
          {...register("firstName", {
            required: true,
          })}
        />
        {errors.firstName && (
          <p>{errorMessages.firstName[errors.firstName?.type]}</p>
        )}

        <input
          type="text"
          placeholder="Middle Name"
          {...register("MiddleName")}
        />

        <input
          type="text"
          placeholder="Last Name"
          {...register("lastName", { required: true })}
        />

        {errors.lastName && (
          <p>{errorMessages.lastName[errors.lastName?.type]}</p>
        )}

        <input
          type="department"
          placeholder="department"
          {...register("department", { required: true })}
        />

        {errors.department && (
          <p>{errorMessages.department[errors.department?.type]}</p>
        )}

        {errors.root?.type == "server" && <p>{errors.root.message}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default CompleteSignUp;
