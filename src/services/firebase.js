import { FieldValue, firebase } from "../lib/firebase";

export async function doesUsernameExists(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();
  return result.docs.map((user) => user.data.length > 0);
}

export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
  return user;
}

export async function getSuggestedProfiles(userId, following) {
  const result = await firebase.firestore().collection("users").limit(10).get();
  return result.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    );
}

export async function updateFollowedUserFollowers(
  loggedInUserDocId,
  profileId,
  isFollowingProfile
) {
  if (!loggedInUserDocId || !profileId) {
    console.error("❌ Error: Missing required values:", {
      loggedInUserDocId,
      profileId,
    });
    return;
  }

  const userRef = firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId);
  const docSnapshot = await userRef.get();

  if (!docSnapshot.exists) {
    console.error(
      `❌ No document found for loggedInUserDocId: ${loggedInUserDocId}`
    );
    return;
  }

  return userRef.update({
    following: isFollowingProfile
      ? FieldValue.arrayRemove(profileId)
      : FieldValue.arrayUnion(profileId),
  });
}

export async function updateLoggedInUserFollowing(
  profileDocId,
  loggedInUserDocId,
  isFollowingProfile
) {
  if (!profileDocId || !loggedInUserDocId) {
    console.error("❌ Error: Missing required values:", {
      profileDocId,
      loggedInUserDocId,
    });
    return;
  }

  const profileRef = firebase.firestore().collection("users").doc(profileDocId);
  const docSnapshot = await profileRef.get();

  if (!docSnapshot.exists) {
    console.error(`❌ No document found for profileDocId: ${profileDocId}`);
    return;
  }

  return profileRef.update({
    following: isFollowingProfile
      ? FieldValue.arrayRemove(loggedInUserDocId)
      : FieldValue.arrayUnion(loggedInUserDocId),
  });
}


export async function getPhotos(userId,following){
  const result = await firebase.firestore().collection('photos').where('userId','in',following).get();
  const userFollwedPhotos = result.docs.map((photo)=>({
    ...photo.data(),
    docId:photo.id,
  }))
  console.log("userFollwedPhotos", userFollwedPhotos);
  
  const photosWithUserDetails=await Promise.all(userFollwedPhotos.map(async(photo)=>{
    let userLikedPhoto = false;
    if(photo.likes.includes(userId)){
      userLikedPhoto = true
    }
    const user = await getUserByUserId(photo.userId);
    const {username} = user[0];
    return{username,...photo,userLikedPhoto}
  }))
  return photosWithUserDetails;
}