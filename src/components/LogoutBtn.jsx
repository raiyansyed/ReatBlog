import React from "react";
import authService from "../appwrite/auth";
import { logout } from "../store/authSlice";
import { useDispatch } from "react-redux";

export default function LogoutBtn() {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    authService
      .logout()
      .then(() => {
        dispatch(logout());
      })
      .catch(
        console.log("Error in loging out...")
      );
  };
  return <button className="">Logout</button>;
}
