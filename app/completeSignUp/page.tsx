"use client";
// pages/SignIn.tsx
import React from "react";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc, updateDoc } from "firebase/firestore";
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
  const { user, userData, loading, errorUserData } = useUserState();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorUserData) {
    return <div>Error: {errorUserData?.message}</div>;
  }

  if (!user) {
    return <div>Error: User not found</div>;
  }

  if (userData && userData.completeSignUp) {
    return router.push("/");
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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
  };

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
