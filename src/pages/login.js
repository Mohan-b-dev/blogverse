import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";
const Login = () => {
  const navigate = useNavigate();
  const { firebase } = useContext(firebaseContext);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const isInvaild = password === "" || emailAddress === "";

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.log("error code", error.code);
      if (error.code === "auth/invalid-email") {
        setError("The email address is badly formatted");
      } else if (error.code === "auth/invalid-credential") {
        setError("The login credentials are invalid");
      } else {
        setError(error.message);
      }
      setEmailAddress("");
      setPassword("");
    }
  };

  useEffect(() => {
    document.title = "Login-Blog_Application";
  }, []);
  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen">
      <div className="flex w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
        />
      </div>
      <div className="flex flex-col w-2/5">
        <h1 className="flex justify-center w-full">
          <img
            src="/images/logo.png"
            alt="Instagram"
            className="mt-2 w-6/12 mb-4"
          />
        </h1>
        {error && <p className="text-xs text-red-primary">{error}</p>}
        <form onSubmit={handleLogin} method="post">
          <input
            aria-label="Enter your email address"
            type="text"
            placeholder="email address"
            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={({ target }) => setEmailAddress(target.value)}
            value={emailAddress}
          />

          <input
            aria-label="Enter your password"
            type="password"
            placeholder="password"
            className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-300 rounded mb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onChange={({ target }) => setPassword(target.value)}
            value={password}
          />

          <button
            disabled={isInvaild}
            type="sumbit"
            className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${
              isInvaild && "opacity-50"
            }`}
          >
            Login
          </button>
          <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary mt-4">
            <p>
              Don't have an account?
              <Link className="font-bold text-blue-medium" to={ROUTES.SIGN_UP}>
                Sign Up
              </Link>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
