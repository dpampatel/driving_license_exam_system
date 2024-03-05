const redirectIfNonExaminerMiddleware = (req, res, next) => {
  if (req.session.user_UserType !== "Examiner") {
    return res.redirect("/home"); // if user non examiner, redirect to home page
  }
  next();
};
export default redirectIfNonExaminerMiddleware;
