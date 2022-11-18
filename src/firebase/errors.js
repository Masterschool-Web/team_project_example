export const processFirebaseErrors = (msg) => {
  switch (msg) {
    case "Firebase: Error (auth/email-already-in-use).":
      return "Email already in use, choose another email";
    case "Firebase: Error (auth/invalid-email).":
      return "Email is invalid, choose a valid email: example@example.com";
    case "Firebase: Error (auth/internal-error).":
      return "Cannot process request, something went wrong";
    case "Firebase: Password should be at least 6 characters (auth/weak-password).":
      return "Password should be at least 6 characters";
    case "Firebase: Error (auth/wrong-password).":
      return "Wrong password, please try again";
    default:
      return msg;
  }
};
