import React, { useState } from "react";
import { Link, NavLink, Navigate, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice.js";
import { Button, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth.js";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin({ userData }));
        navigate("/");
      }
    } catch (err) {
      // Already logged in (duplicate session attempt)
      if (err?.code === 409) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({ userData }));
          navigate("/");
          return;
        }
      }
      setError(err.message);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl border border-black/10 p-10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block max-w-[100px]">
            <Logo width="w-25" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in into Your Account
        </h2>
        <p className="text-center text-base mt-2 text-black/60">
          Don&apos;t have an account?&nbsp;
          <Link
            className="font-medium transition-all duration-100 hover:underline text-primary"
            to="/signup"
          >
            SignUp
          </Link>
        </p>
        {error && <p className="text-center text-red-600 mt-8">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      value
                    ) || "Email address must be a valid address",
                },
              })}
            />
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your Password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full hover:to-blue-500">
              SignIn
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
