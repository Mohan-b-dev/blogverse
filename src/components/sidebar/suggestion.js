import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import { getSuggestedProfiles } from "../../services/firebase";
import SuggestedProfile from "./suggested-profile";
const Suggestion = ({ userId ,following,loggedInDocId}) => {
  const [profiles, setProfiles] = useState(null);

  //get the suggestions profile
  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getSuggestedProfiles(userId,following);
      setProfiles(response);
    }
    if (userId) {
      suggestedProfiles();
    }
  }, [userId]);

  return !profiles ? (
    <Skeleton count={1} height={150} />
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center  justify-center">
        <p className="font-bold text-gray-base">Suggestion for you</p>
      </div>
      <div className="mt-4 grid gap-3">
        {profiles.map((profile) => (
          <SuggestedProfile
            key={profile.docId}
            profileDocId={profile.docId}
            username={profile.username}
            profileId={profile.userId}
            userId={userId}
            loggedInUserDocId={loggedInDocId}
          />
        ))}
      </div>
    </div>
  ) : null;
};
export default Suggestion;

Suggestion.propTypes = {
  userId: PropTypes.string,
  following: PropTypes.array,
  loggedInDocId: PropTypes.string,
};
