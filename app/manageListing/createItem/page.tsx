"use client";

import Layout from "@/components/Layout";
import PageLoading from "@/components/PageLoading";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { useApp } from "@/store/app";
import { useAuth } from "@/store/auth";
import { useState } from "react";
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
  const {
    categories,
    categoriesLoading,
    categoriesError,
    campuses,
    campusesError,
    campusesLoading,
  } = useApp();
  const [tags, setTags] = useState<string[]>([]);

  const conditions = {
    new: "New",
    usedLikeNew: "Used - Like New",
    usedGood: "Used - Good",
    usedFair: "Used - Fair",
  };

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

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        e.currentTarget.value = "";
      }
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
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
          <div className="flex flex-col lg:flex-row ">
            <div className="w-full lg:w-1/2">Image</div>
            <div className="w-full lg:w-1/2">
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
                    placeholder="₱0"
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
                    placeholder="₱0"
                    {...register("discount", {
                      required: true,
                    })}
                  />
                  <div className="label"></div>
                </label>
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Condition</span>
                </div>
                <select
                  {...register("condition", {
                    required: true,
                  })}
                  defaultValue=""
                  className={`select select-bordered w-full ${
                    errors.condition && "select-error text-error"
                  }`}
                >
                  <option value="" disabled>
                    Select Condition
                  </option>
                  {Object.entries(conditions).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <div className="label">
                  {errors.condition && (
                    <span className="label-text-alt text-error">
                      {errorMessages.condition[errors.condition?.type]}
                    </span>
                  )}
                </div>
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Category</span>
                </div>
                <select
                  {...register("category", {
                    required: true,
                  })}
                  defaultValue=""
                  className={`select select-bordered w-full ${
                    errors.category && "select-error text-error"
                  }`}
                >
                  <option value="" disabled>
                    {categoriesLoading
                      ? "Loading Categories"
                      : categoriesError
                      ? "Error Loading Categories"
                      : "Select Category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.key}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="label">
                  {errors.category && (
                    <span className="label-text-alt text-error">
                      {errorMessages.category[errors.category?.type]}
                    </span>
                  )}
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description</span>
              </div>
              <textarea
                {...register("description", {
                  required: true,
                })}
                className={`textarea textarea-bordered w-full ${
                  errors.description && "textarea-error text-error"
                }`}
                placeholder="Item Description"
              ></textarea>
              <div className="label">
                {errors.description && (
                  <span className="label-text-alt text-error">
                    {errorMessages.description[errors.description?.type]}
                  </span>
                )}
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Campus</span>
              </div>
              <select
                {...register("campus", {
                  required: true,
                })}
                defaultValue=""
                className={`select select-bordered w-full ${
                  errors.campus && "select-error text-error"
                }`}
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
                {errors.campus && (
                  <span className="label-text-alt text-error">
                    {errorMessages.campus[errors.campus?.type]}
                  </span>
                )}
              </div>
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Tags</span>
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter a tag"
                  className="input input-bordered w-full text-sm"
                  onKeyDown={handleTagKeyDown}
                />
              </div>
              <div className="mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge badge-primary mr-2 mb-2 cursor-pointer text-sm rounded-md p-3"
                    onClick={() => removeTag(tag)}
                  >
                    {tag}
                    <button type="button" className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </label>
          </div>

          <div className="space-x-3 flex justify-end mt-5">
            <button className="btn btn-primary btn-outline w-24">
              Discard
            </button>
            <button type="submit" className="btn btn-primary w-24">
              Submit
            </button>
          </div>
        </form>
      </main>
    </Layout>
  );
};

export default ManageListing;
