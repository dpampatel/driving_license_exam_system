const redirectIfNonAdminMiddleware = (req, res, next) => {
  if (req.session.user_UserType !== "Admin") {
    return res.redirect("/home"); // if user non admin, redirect to home page
  }
  next();
};
export default redirectIfNonAdminMiddleware;
