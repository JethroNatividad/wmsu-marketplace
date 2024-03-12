"use client";

import Layout from "@/components/Layout";
import PageLoading from "@/components/PageLoading";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useAuth } from "@/store/auth";
import {
  LiteralUnion,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";

type Inputs = {
  itemName: string;
  price: number;
  discount?: number;
  category: string;
  condition: string;
  description: string;
  campus: string;
  tags: string[];
};

type ErrorOptionTypes = LiteralUnion<keyof RegisterOptions, string>;

type ErrorMessages = {
  [K in keyof Inputs]: {
    [T in ErrorOptionTypes]?: string;
  };
};

const errorMessages: ErrorMessages = {
  itemName: {
    required: "Item Name is required",
  },
  price: {
    required: "Price is required",
  },
  category: {
    required: "Category is required",
  },
  condition: {
    required: "Condition is required",
  },
  description: {
    required: "Description is required",
  },
  campus: {
    required: "Campus is required",
  },
  tags: {
    required: "Tags is required",
  },
};

const ManageListing = () => {
  const { loading, userData, user } = useAuth();

  useAuthRedirect();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async () => {
    try {
      //   await signInWithEmailAndPassword(auth, email, password);
      //   router.push("/");
    } catch (error) {
      setError("root", {
        type: "server",
        message: (error as Error).message,
      });
    }
  };

  if (loading || !userData?.completeSignUp || !user?.emailVerified) {
    return <PageLoading />;
  }

  return (
    <Layout>
      <main className="p-5">
        <p>{userData?.firstName}</p>
        <h1 className="text-2xl font-bold">New Item For Sale</h1>
        <form
          className="w-full px-5 py-10 lg:py-0"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex">
            <div className="w-1/2">Image</div>
            <div className="w-1/2">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Item Name</span>
                </div>
                <input
                  className={`input input-bordered w-full ${
                    errors.itemName && "input-error text-error"
                  }`}
                  type="text"
                  placeholder="iPhone 12 Pro Max"
                  {...register("itemName", {
                    required: true,
                  })}
                />
                <div className="label">
                  {errors.itemName && (
                    <span className="label-text-alt text-error">
                      {errorMessages.itemName[errors.itemName?.type]}
                    </span>
                  )}
                </div>
              </label>

              <div className="flex space-x-5">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Price</span>
                  </div>
                  <input
                    className={`input input-bordered w-full ${
                      errors.price && "input-error text-error"
                    }`}
                    type="number"
                    placeholder="iPhone 12 Pro Max"
                    {...register("price", {
                      required: true,
                    })}
                  />
                  <div className="label">
                    {errors.price && (
                      <span className="label-text-alt text-error">
                        {errorMessages.price[errors.price?.type]}
                      </span>
                    )}
                  </div>
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Discount</span>
                  </div>
                  <input
                    className={`input input-bordered w-full ${
                      errors.discount && "input-error text-error"
                    }`}
                    type="number"
                    placeholder="iPhone 12 Pro Max"
                    {...register("discount", {
                      required: true,
                    })}
                  />
                  <div className="label"></div>
                </label>
              </div>
            </div>
          </div>
        </form>
      </main>
    </Layout>
  );
};

export default ManageListing;
