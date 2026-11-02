"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

/* ---------- Types ---------- */
interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  image: string;
  
}

/* ---------- Shared input styling (fixes invisible placeholder) ---------- */
const inputClasses =
  "input w-full bg-slate-50 text-slate-900 caret-blue-600 " +
  "placeholder:text-slate-400 placeholder:opacity-100 " +
  "border-2 border-slate-200 rounded-lg " +
  "focus:border-blue-500 focus:bg-white focus:outline-none transition-colors";

const legendClasses = "fieldset-legend text-sm font-semibold text-slate-700";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();

  const router = useRouter();

  const handleGoogleSignin = async (): Promise<void> => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    console.log(data, "data");
  };

  const handleRegisterFunc = async (data: SignUpFormData): Promise<void> => {
    console.log(data, "data");

    const { name, email, password, image } = data;

    const { data: res, error } = await authClient.signUp.email({
      name, // required
      email, // required
      image,
      password, // required
      autoSignIn: false,
      callbackURL: "/login",
    });

    console.log("data:res", res, "Error", error);

    if (error) {
      alert(error.message);
      return;
    }

    if (res) {
      // await authClient.signOut();
      alert("Signup Successful");
      router.push("/signin");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col gap-5">
        <h2 className="font-bold text-2xl text-center text-slate-800">
          Sign Up
        </h2>

        <form
          onSubmit={handleSubmit(handleRegisterFunc)}
          className="w-full flex flex-col gap-1"
        >
          {/* Name */}
          <fieldset className="fieldset">
            <legend className={legendClasses}>Name</legend>
            <input
              type="text"
              className={inputClasses}
              placeholder="Enter Your Name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </fieldset>

          {/* Email */}
          <fieldset className="fieldset">
            <legend className={legendClasses}>Email</legend>
            <input
              type="email"
              className={inputClasses}
              placeholder="Enter Your Email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </fieldset>

          {/* Photo URL */}
          <fieldset className="fieldset">
            <legend className={legendClasses}>Photo URL</legend>
            <input
              type="text"
              className={inputClasses}
              placeholder="Photo url"
              {...register("image", { required: "Photo url is required" })}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset">
            <legend className={legendClasses}>Password</legend>
            <input
              type="password"
              className={inputClasses}
              placeholder="Enter your Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: {
                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value) ||
                    "Password must contain at least one uppercase letter",
                  hasLowerCase: (value) =>
                    /[a-z]/.test(value) ||
                    "Password must contain at least one lowercase letter",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm font-bold mt-1">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              Must contain uppercase, lowercase, and at least 6 characters
            </p>
          </fieldset>

          <Button
            type="submit"
            isDisabled={isSubmitting}
            className="w-full mt-3 font-bold bg-[#EB7036]  hover:bg-[#D9EF78] text-black transition-colors"
          >
            {isSubmitting ? "Registering..." : "Sign Up"}
          </Button>

          <div className="flex items-center gap-3 my-3">
            <span className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">OR</span>
            <span className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignin}
            className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 py-2.5 font-bold text-orange-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            Continue with Google
          </button>

          <p className="text-sm text-center text-slate-600 mt-4">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-bold text-orange-700 hover:text-blue-800 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;





