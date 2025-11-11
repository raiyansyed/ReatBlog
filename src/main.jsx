import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { AuthLayout } from "./components/index.js";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  AddPost,
  AllPost,
  EditPost,
  Home,
  Login,
  Post,
  Signup,
} from "./pages/index.js";

import store from "./store/store.js";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route
              path="login"
              element={
                <AuthLayout authentication={false}>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="signup"
              element={
                <AuthLayout authentication={false}>
                  <Signup />
                </AuthLayout>
              }
            />
            <Route
              path="all-posts"
              element={
                <AuthLayout authentication>
                  <AllPost />
                </AuthLayout>
              }
            />
            <Route
              path="add-post"
              element={
                <AuthLayout authentication>
                  <AddPost />
                </AuthLayout>
              }
            />
            <Route
              path="edit-post/:slug"
              element={
                <AuthLayout authentication>
                  <EditPost />
                </AuthLayout>
              }
            />
            <Route path="post/:slug" element={<Post />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
