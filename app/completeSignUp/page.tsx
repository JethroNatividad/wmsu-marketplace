"use client";
// pages/SignIn.tsx
import React, { useEffect } from "react";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { auth, db } from "../../firebase";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";

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

  useEffect(() => {
    const handleCompleteUser = async () => {
      // Check if the user's email is verified
      if (user.emailVerified) {
        // Check if user has completed sign up, (added name, etc.)
        // Redirect to /
        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);
        if (userData.exists() && userData.data()?.completeSignUp) {
          return router.push("/");
        }
      }
    };

    if (!loadingUser && !errorUser && user) {
      handleCompleteUser();
    }
  }, [user, loadingUser, errorUser]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({}) => {
    try {
      const userRef = doc(db, "users", user.uid);
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

        {errors.root?.type == "server" && <p>{errors.root.message}</p>}
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

export default CompleteSignUp;
