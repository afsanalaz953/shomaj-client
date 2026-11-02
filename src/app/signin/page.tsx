"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

/* ---------- Types ---------- */
interface SignInFormData {
  email: string;
  password: string;
}

/* ---------- Shared input styling (fixes invisible placeholder) ---------- */
const inputClasses =
  "input w-full bg-slate-50 text-slate-900 caret-blue-600 " +
  "placeholder:text-slate-400 placeholder:opacity-100 " +
  "border-2 border-slate-200 rounded-lg " +
  "focus:border-blue-500 focus:bg-white focus:outline-none transition-colors";

const legendClasses = "fieldset-legend text-sm font-semibold text-slate-700";

const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>();

  const [isShowPassword, setIsShowPassword] = useState(false);

  // Modal is commented out below, so only the setter is used for now.
  // const [, setIsForgotDialogOpen] = useState(false);

  const handleGoogleSignin = async (): Promise<void> => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    console.log(data, "data");
  };

  const handleLoginFunc = async (data: SignInFormData): Promise<void> => {
    console.log(data, "data");

    const { data: res, error } = await authClient.signIn.email({
      email: data.email, // required
      password: data.password, // required
      rememberMe: true,
      callbackURL: "/",
    });

    console.log(res, error);

    if (error) {
      alert(error.message);
      return;
    }

    if (res) {
      alert("Signin Successful");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8 flex flex-col gap-2">
        <h2 className="font-bold text-2xl text-center text-slate-800">
          Sign In
        </h2>

        <p className="text-slate-400 text-center text-sm">
          Please signin to continue
        </p>

        <form
          onSubmit={handleSubmit(handleLoginFunc)}
          className="space-y-3 mt-4 w-full"
        >
          {/* Email */}
          <fieldset className="fieldset">
            <legend className={legendClasses}>Email</legend>
            <input
              type="email"
              className={inputClasses}
              placeholder="Enter Your Email"
              autoComplete="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset">
            <legend className={legendClasses}>Password</legend>

            <div className="relative">
              <input
                type={isShowPassword ? "text" : "password"}
                className={`${inputClasses} pr-10`}
                placeholder="Enter your Password"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                })}
              />

              <button
                type="button"
                onClick={() => setIsShowPassword(!isShowPassword)}
                aria-label={isShowPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                <FaRegEyeSlash />
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </fieldset>

          {/* Forgot password */}
          {/* <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              onClick={() => setIsForgotDialogOpen(true)}
            >
              Forgot Password?
            </button>
          </div> */}

          <Button
            type="submit"
            isDisabled={isSubmitting}
            className="w-full mt-2 font-bold bg-orange-700  hover:bg-[#D9EF78] text-black  transition-colors"
          >
            {isSubmitting ? "Logging in..." : "Sign In"}
          </Button>

          <div className="flex items-center gap-3 my-3">
            <span className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">OR, Continue With</span>
            <span className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignin}
            className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 py-2.5 font-bold text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            Continue with Google
          </button>

          <p className="text-sm text-center text-slate-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-orange-700 hover:text-yellow-700 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {/*
        ForgotPasswordModal is commented out in your original file.
        When you re-enable it, change the state line above to:
        const [isForgotDialogOpen, setIsForgotDialogOpen] = useState(false);
        and pass the props to <ForgotPasswordModal />.
      */}
    </div>
  );
};

export default SignInPage;





// end
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSeparator,
// } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"

// export default function SignInPage({
 
 
// }: React.ComponentProps<"div">) {
//   return (
//     <div className='flex flex-col gap-6 container mx-auto my-10' >
//         <div className="max-w-2xl container mx-auto py-10 ">
//  <Card className="">
//         <CardHeader className="text-center">
//           <CardTitle className="text-3xl">Welcome back</CardTitle>
//           <CardDescription>
//             Enter your account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form>
//             <FieldGroup>
              
//                 <Field>
//                 <FieldLabel htmlFor="name" className="font-bold text-xl" >Name</FieldLabel>
//                 <Input
//                   id="name"
//                   type="name"
//                   placeholder="Mr. Rahim"
//                   required
//                   className="text-slate-100"
//                 />
//               </Field>
//                 <Field>
//                 <FieldLabel htmlFor="image"className="font-bold text-xl"  >Image Url</FieldLabel>
//                 <Input
//                   id="image"
//                   type="url"
//                   placeholder="Image url"
//                   required
//                 />
//               </Field>
//               <Field>
//                 <FieldLabel htmlFor="email"className="font-bold text-xl"  >Email</FieldLabel>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                 />
//               </Field>
//               <Field>
//                 <div className="flex items-center">
//                   <FieldLabel htmlFor="password"className="font-bold text-xl" >Password</FieldLabel>
//                   {/* <a
//                     href="#"
//                     className="ml-auto text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </a> */}
//                 </div>
//                 <Input id="password" type="password" required />
//               </Field>
//               <Field>
//                 <Button type="submit">Sign In</Button>
//                 <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card my-2">
//                 Or continue with
//               </FieldSeparator>
// <Field className=" justify-center items-center gap-4" orientation="horizontal">
//                 <Button  variant="outline" type="button">
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                     <path
//                       d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
//                       fill="currentColor"
//                     />
//                   </svg>
//                   Login with Apple
//                 </Button>
//                 <Button variant="outline" type="button">
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                     <path
//                       d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
//                       fill="currentColor"
//                     />
//                   </svg>
//                   Login with Google
//                 </Button>
//               </Field>

//                 <FieldDescription className="text-center">
//                    Don&apos;t have an account? <a href="#">Sign up</a>
//                 </FieldDescription>
//               </Field>
//             </FieldGroup>
//           </form>
//         </CardContent>
//       </Card>
//         </div>
     
     
//     </div>
//   )
// }
