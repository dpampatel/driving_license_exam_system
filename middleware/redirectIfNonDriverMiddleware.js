const redirectIfNonDriverMiddleware = (req, res, next) => {
  if (req.session.user_UserType !== "Driver") {
    return res.redirect("/home"); // if user non driver, redirect to home page
  }
  next();
};
export default redirectIfNonDriverMiddleware;
