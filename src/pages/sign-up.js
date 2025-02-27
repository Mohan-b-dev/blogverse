import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FirebaseContext from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { doesUsernameExists } from "../services/firebase";

const SignUp = () => {
  const navigate = useNavigate();
  const { firebase } = useContext(FirebaseContext);

  // State variables
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Form validation
  const isInvalid = password === "" || emailAddress === "";

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    try {
      console.log("Checking if username exists:", username);
      const usernameExists = await doesUsernameExists(username);

      if (usernameExists.length === 0) {
        console.log("Username available. Creating user...");

        // Create user in Firebase Auth
        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(emailAddress, password);

        console.log("User Created:", createdUserResult.user);

        // Update user profile
        await createdUserResult.user.updateProfile({
          displayName: username,
        });

        // Add user to Firestore database
        await firebase.firestore().collection("users").add({
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          emailAddress: emailAddress.toLowerCase(),
          following: [],
          dateCreated: Date.now(),
        });

        // ✅ Reset form after successful signup
        setUsername("");
        setFullName("");
        setEmailAddress("");
        setPassword("");

        navigate(ROUTES.DASHBOARD);
      } else {
        setError("This username already exists. Please try another one.");
      }
    } catch (error) {
      console.error("Signup Error:", error.code, error.message);
      setError(error.message); // Show exact Firebase error message
    }
  };

  useEffect(() => {
    document.title = "Sign Up - Instagram";
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

        <form onSubmit={handleSignUp} method="POST">
          <input
            aria-label="Enter your Username"
            type="text"
            placeholder="Username"
            className="text-sm text-gray-base w-full py-5 px-4 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setUsername(target.value)}
            value={username}
            required
          />
          <input
            aria-label="Enter your Full Name"
            type="text"
            placeholder="Full Name"
            className="text-sm text-gray-base w-full py-5 px-4 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setFullName(target.value)}
            value={fullName}
            required
          />
          <input
            aria-label="Enter your email address"
            type="email"
            placeholder="Email address"
            className="text-sm text-gray-base w-full py-5 px-4 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setEmailAddress(target.value)}
            value={emailAddress}
            required
          />
          <input
            aria-label="Enter your password"
            type="password"
            placeholder="Password"
            className="text-sm text-gray-base w-full py-5 px-4 border border-gray-primary rounded mb-2"
            onChange={({ target }) => setPassword(target.value)}
            value={password}
            required
          />
          <button
            disabled={isInvalid}
            type="submit"
            className={`bg-blue-medium text-white w-full rounded h-8 font-bold ${
              isInvalid && "opacity-50"
            }`}
          >
            Sign Up
          </button>

          <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary mt-4">
            <p>
              Have an account?{" "}
              <Link to={ROUTES.LOGIN} className="font-bold text-blue-medium">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
