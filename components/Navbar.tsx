import { auth } from "@/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useSignOut } from "react-firebase-hooks/auth";

const Navbar = () => {
  const router = useRouter();
  const [signOut] = useSignOut(auth);
  const handleSignOut = async () => {
    router.push("/signIn");
    await signOut();
  };
  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <div className="flex-none lg:hidden">
          <label
            htmlFor="sidebar"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-6 h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          WMSU Marketplace
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full bg-black"></div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <button onClick={handleSignOut}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
