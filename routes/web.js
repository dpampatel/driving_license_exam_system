/* Sir: File name web.js or route.js any will work */
import express from "express";
import Controller from "../controllers/controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import redirectIfNonDriverMiddleware from "../middleware/redirectIfNonDriverMiddleware.js";
import redirectIfNonAdminMiddleware from "../middleware/redirectIfNonAdminMiddleware.js";
import redirectIfAuthenticatedMiddleware from "../middleware/redirectIfAuthenticatedMiddleware.js";
import redirectIfNonExaminerMiddleware from "../middleware/redirectIfNonExaminerMiddleware.js";

const router = express.Router();

/* get and post methods */
router.get("/home", Controller.home_controller);
router.get(
  "/G2",
  authMiddleware,
  redirectIfNonDriverMiddleware,
  Controller.g2_get_controller
);
router.post(
  "/G2",
  authMiddleware,
  redirectIfNonDriverMiddleware,
  Controller.g2_post_controller
);
router.get(
  "/G",
  authMiddleware,
  redirectIfNonDriverMiddleware,
  Controller.g_get_controller
);
router.post("/find", Controller.g_find_controller);
router.post(
  "/update",
  authMiddleware,
  redirectIfNonDriverMiddleware,
  Controller.update_post_controller
);
router.get(
  "/login",
  redirectIfAuthenticatedMiddleware,
  Controller.login_get_controller
);
router.post(
  "/signup",
  redirectIfAuthenticatedMiddleware,
  Controller.signup_post_controller
);
router.post(
  "/login",
  redirectIfAuthenticatedMiddleware,
  Controller.login_post_controller
);
router.get("/logout", authMiddleware, Controller.logout_get_controller);
router.get(
  "/appointment",
  authMiddleware,
  redirectIfNonAdminMiddleware,
  Controller.appointment_get_controller
);
router.post(
  "/appointment",
  authMiddleware,
  redirectIfNonAdminMiddleware,
  Controller.appointment_post_controller
);
router.post(
  "/book",
  authMiddleware,
  redirectIfNonDriverMiddleware,
  Controller.book_post_controller
);
router.get(
  "/examiner",
  authMiddleware,
  redirectIfNonExaminerMiddleware,
  Controller.examiner_get_controller
);
router.post(
  "/mark",
  authMiddleware,
  redirectIfNonExaminerMiddleware,
  Controller.mark_post_controller
);
router.get(
  "/candidates",
  authMiddleware,
  redirectIfNonAdminMiddleware,
  Controller.candidate_get_controller
);

export default router;
