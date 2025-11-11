import React from "react";
import authService from "../appwrite/auth.js";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";

export default function LogoutBtn() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    authService
      .logout()
      .then(() => dispatch(logout()))
      .catch(err => console.log('Error in logging out...', err))
  };
  return <button className="inline-block px-6 py-2 rounded-full hover:bg-blue-100 duration-200"
  onClick={logoutHandler}>Logout</button>;
}
