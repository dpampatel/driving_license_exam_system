const redirectIfAuthenticatedMiddleware = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect("/home"); // if logged in, redirect to home page
  }
  next();
};
export default redirectIfAuthenticatedMiddleware;
