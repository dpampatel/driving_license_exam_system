import userModel from "../models/user_model.js";
const authMiddleware = async (req, res, next) => {
  const l_user = await userModel.findById(req.session.user_id);
  if (!l_user) {
    return res.redirect("/login");
  }
  next();
};
export default authMiddleware;
