"use client";

import { UserDataContext } from "@/context/UserContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useState } from "react";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const context = useContext(UserDataContext);
  if (!context) throw new Error("UserContext is undefined");

  const { setUser } = context;

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          fullname: { firstname: firstName, lastname: lastName }, 
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        router.push("/users/home");
      }
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        // @ts-expect-error: err.response may exist
        console.error("Signup failed:", err.response?.data || (err as Error).message);
      } else {
        console.error("Signup failed:", (err as Error).message);
      }
    }

    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="bg-cover bg-center bg-[url('https://img.freepik.com/free-photo/green-traffic-light-rain-cars-drive-by_181624-45198.jpg?ga=GA1.1.1679696074.1749474067&semt=ais_hybrid&w=740')] min-h-screen flex flex-col justify-end">
      <div className="bg-white rounded-t-3xl px-6 py-8 sm:px-10 sm:py-10 shadow-2xl w-full">
        <form onSubmit={submitHandler} className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create your CampusCab Account
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-5">
            <input
              required
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
            <input
              required
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <input
            required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-5 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            required
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            Sign Up
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserSignup;
