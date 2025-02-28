import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion"; // Import Framer Motion
import FirebaseContext from "../../context/firebase";
import UserContext from "../../context/user";

const Actions = ({ docId, totalLikes, likedPhoto, handleFocus }) => {
  const {
    user: { uid: userId = "" },
  } = useContext(UserContext);
  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totalLikes);
  const { firebase, FieldValue } = useContext(FirebaseContext);

  const handleToggleLiked = async () => {
    setToggleLiked((toggleLiked) => !toggleLiked);

    await firebase
      .firestore()
      .collection("photos")
      .doc(docId)
      .update({
        likes: toggleLiked
          ? FieldValue.arrayRemove(userId)
          : FieldValue.arrayUnion(userId),
      });

    setLikes((likes) => (toggleLiked ? likes - 1 : likes + 1));
  };

  return (
    <div className="flex justify-between p-4">
      <div className="flex items-center space-x-4">
        {/* Like Button with Animation */}
        <motion.svg
          whileTap={{ scale: 0.8 }} // Shrink effect on tap
          animate={{ scale: toggleLiked ? 1.2 : 1 }} // Slightly enlarge when liked
          transition={{ duration: 0.3, ease: "easeInOut" }} // Smooth transition
          className={`w-8 cursor-pointer select-none transition-all duration-300 ${
            toggleLiked ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
          onClick={handleToggleLiked}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleToggleLiked();
            }
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </motion.svg>

        {/* Comment Button with Animation & Tooltip */}
        <motion.div
          className="relative flex items-center group"
          whileHover={{ scale: 1.1 }} // Grow effect on hover
          whileTap={{ scale: 0.8 }} // Shrink effect on click
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 cursor-pointer text-gray-600 select-none hover:text-blue-500 transition-all duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </motion.svg>
        </motion.div>
      </div>
      <div className="p-4 py-0">
        <p className="font-bold">
          {likes === 1 ? `${likes}like` : `${likes}likes`}
        </p>
      </div>
    </div>
  );
};

export default Actions;

Actions.propTypes = {
  docId: PropTypes.string.isRequired,
  totalLikes: PropTypes.number.isRequired,
  likedPhoto: PropTypes.bool.isRequired,
  handleFocus: PropTypes.func.isRequired,
};
