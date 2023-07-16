import path from "path";
/* Forget Password PAGE */

const getResetPassword = (req, res) => {
  res.sendFile(path.join(__dirname, "../../", "views", "ResetPassword.html"));
};

export { getResetPassword };
