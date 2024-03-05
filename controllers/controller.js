import userModel from "../models/user_model.js"; // importing user model
import appointmentModel from "../models/appointment_model.js";
import bcrypt from "bcrypt";
class Controller {
  constructor() {
    this.recordToUpdate = {}; // variable to store data for update
  }
  static home_controller = (req, res) => {
    res.render("index"); // dashboard rendering
  };
  static g2_get_controller = async (req, res) => {
    let user = await userModel.findOne({
        _id: req.session.user_id,
      }),
      response = { status: "" },
      result = {}; // Model.findOne to find data using user id
    if (user) {
      if (user.license != "default") {
        response = app_response || { status: "" };
        result = user;
        if (user.appointment_id) {
          result.appointment = await appointmentModel.findById(
            user.appointment_id
          );
        } else {
          result.availability = await appointmentModel
            .find({
              isTimeSlotAvailable: true,
              date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            })
            .exec();
        }
      }
      res.render("page-g2", { response, result }); // result and response is used in form
      app_response = null;
    } else {
      req.session.destroy();
      return res.redirect("login");
    }
  };
  static g2_post_controller = async (req, res) => {
    try {
      const form_data = req.body; // parse data from form
      let user = await userModel.findOne({
        _id: req.session.user_id,
      }); // Model.findOne to find data using user id
      let l_license_no = form_data.license;
      /*
      //license encryption start
      l_license_no = await bcrypt.hash(l_license_no, 13);
      //license encryption end
      */
      if (user) {
        // create new record to store in mongo db
        Object.assign(user, {
          firstname: form_data.first,
          lastname: form_data.last,
          license: l_license_no,
          age: form_data.age,
          dob: form_data.dob,
          car_details: {
            make: form_data.carmake,
            model: form_data.carmodel,
            year: form_data.caryear,
            platno: form_data.carplate,
          },
        });
        const driver_saved = await user.save(); // Model.save to upload data
        app_response = {
          status: "success",
          message:
            "Your information is stored, please go to <strong><u><a href='/G'>G page</a></u></strong>.",
        };
        return res.redirect("G2");
        //res.render("page-g2", { response, result: driver_saved }); // show success message above form and repopulate fields
      } else {
        req.session.destroy();
        return res.redirect("login");
      }
    } catch (error) {
      console.log("Error", error);
      app_response = {
        status: "failure",
        message: "Something went wrong. Please contact system adminstrator.",
      };
      return res.redirect("G2");
      //res.render("page-g2", { response, result: user }); // show failure message above form and repopulate field
    }
  };
  static book_post_controller = async (req, res) => {
    try {
      const form_body = req.body;
      const appointment = await appointmentModel
        .findById(form_body.app_id)
        .exec();
      if (!appointment) {
        throw "Error";
      }
      Object.assign(appointment, { isTimeSlotAvailable: false });
      await appointment.save();

      const user = await userModel.findOne({
        _id: req.session.user_id,
      });
      Object.assign(user, {
        appointment_id: form_body.app_id,
        appointment: appointment._id,
        test_type: form_body.test_type,
      });
      if (!user) {
        throw "Error";
      }
      await user.save();
      return res.redirect("G2");
    } catch (error) {
      console.log(error);
      app_response = {
        status: "failure",
        message: "Something went wrong. Please contact system adminstrator.",
      };
      return res.redirect("G2");
    }
  };
  static g_get_controller = async (req, res) => {
    let user = await userModel.findOne({
        _id: req.session.user_id,
      }),
      response = { status: "" },
      result = {}; // Model.findOne to find data using user id
    if (user) {
      if (user.license != "default") {
        response = { status: "success" };
        result = user;
        if (user.appointment_id) {
          result.appointment = await appointmentModel.findById(
            user.appointment_id
          );
        } else {
          result.availability = await appointmentModel
            .find({
              isTimeSlotAvailable: true,
              date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
            })
            .exec();
        }
      }
      res.render("page-g", { response, result }); // response and result required for form
    } else {
      req.session.destroy();
      return res.redirect("login");
    }
  };
  static g_find_controller = async (req, res) => {
    try {
      const form_data = req.body; // body parser data pull
      this.recordToUpdate = await userModel.findOne({
        license: form_data.license,
      }); // Model.findOne to find data using license number

      // storing in recordToUpdate of controller for update operation later.
      const response = {};
      if (this.recordToUpdate) {
        // success condition if user found
        (response.status = "success"), // if success load form 2 (same form used for g2)
          (response.message = "User Found."),
          (response.action = "find");
      } else {
        //failure condition if user not found
        (response.status = "failure"),
          (response.message =
            "No User Found. Please go to <strong><u><a href= '/G2'>G2 page</a></u></strong> and upload your information."),
          (response.action = "find");
      }
      res.render("page-g", { response, result: this.recordToUpdate });
    } catch (error) {
      console.log("Error", error);
      const response = {
          status: "failure",
          message: "Something went wrong. Please contact system administrator.",
          action: "find", // used to disply msg above form 1
        },
        result = {};
      res.render("page-g", { response, result });
    }
  };
  static update_post_controller = async (req, res) => {
    try {
      const form_data = req.body; // parse body to pull data for update
      let user = await userModel.findOne({
          _id: req.session.user_id,
        }),
        response = { status: "" },
        result = {}; // Model.findOne to find data using user id
      if (user) {
        user.car_details = {
          make: form_data.carmake,
          model: form_data.carmodel,
          year: form_data.caryear,
          platno: form_data.carplate,
        }; // populate existing data
        await user.save(); // update data in db
        const response = {
          status: "success",
          message: "Your information is updated.",
        };
        res.render("page-g", { response, result: user }); //display success message and repopulate form 2
      } else {
        req.session.destroy();
        return res.redirect("login");
      }
    } catch (error) {
      console.log("Error", error);
      const response = {
        status: "failure",
        message: "Something went wrong. Please contact system administrator.",
      };
      res.render("page-g", { response, result: user }); // display failure and repopulate grid
    }
  };
  static login_get_controller = (req, res) => {
    res.render("login", { response: {}, result: {} }); // load login.ejs
  };
  static signup_post_controller = async (req, res) => {
    try {
      const form_data = req.body; // parse data from form
      const find_user_in_db = await userModel.findOne({
        username: form_data.username,
      });
      if (find_user_in_db) {
        const response = {
          status: "failure",
          action: "signup",
          message:
            "Username already exists. Please login or use a different username.",
        };
        res.render("login", { response, result: find_user_in_db });
      } else {
        //password encryption start
        let l_password = form_data.password;
        l_password = await bcrypt.hash(l_password, 13);
        //password encryption end

        // create new record to store in mongo db
        const driverToSaveInDb = new userModel({
          username: form_data.username,
          password: l_password,
          usertype: form_data.usertype,
        });

        const driver_saved = await driverToSaveInDb.save(); // Model.save to upload data

        const response = {
          status: "success",
          message: "Please login.",
          action: "signup",
        };
        res.render("login", { response, result: driverToSaveInDb }); // show success message above form and repopulate fields
      }
    } catch (error) {
      console.log("Error", error);
      const response = {
        status: "failure",
        message: "Something went wrong. Please contact system adminstrator.",
      };
      res.render("login", { response, result: form_data }); // show failure message above form and repopulate field
    }
  };
  static login_post_controller = async (req, res) => {
    const form_data = req.body;
    //first we check that it is not a new user by matching username in db
    const user_matched = await userModel.findOne({
      username: form_data.username,
    });
    if (!user_matched) {
      const response = {
        status: "failure",
        action: "login",
        message: "User not found. Please enter correct username or register.",
      };
      res.render("login", { response, result: form_data });
    } else {
      //if user found match password here
      const pwd_matched = await bcrypt.compare(
        form_data.password,
        user_matched.password
      );
      if (pwd_matched) {
        req.session.user_id = user_matched._id;
        req.session.user_UserType = user_matched.usertype;
        usertype = user_matched.usertype;
        return res.redirect("home");
      } else {
        const response = {
          status: "failure",
          action: "login",
          message: "Password Incorrect",
        };
        res.render("login", { response, result: form_data });
      }
    }
  };
  static logout_get_controller = (req, res) => {
    req.session.destroy();
    res.redirect("login");
  };
  static appointment_get_controller = async (req, res) => {
    try {
      const availability = await appointmentModel.find({}).exec();
      res.render("appointment", {
        availability,
      }); // dashboard rendering
      app_response = null;
    } catch (error) {
      console.log("Error", error);
      app_response = {
        status: "failure",
        message: "Something went wrong. Please contact system adminstrator.",
      };
      const availability = await appointmentModel.find({}).exec();
      res.render("appointment", { availability }); // show failure message above form and repopulate field
    }
  };
  static appointment_post_controller = async (req, res) => {
    try {
      const form_data = req.body; // parse data from form
      let resp;
      if (!form_data.data_appointments) {
        return res.redirect("appointment");
      }
      if (form_data.data_appointments.length > 0) {
        resp = await appointmentModel.insertMany(
          form_data.data_appointments.map((item) => {
            return { ...item, date: new Date(item.date) };
          })
        );
      }
      if (resp) {
        app_response = {
          status: "success",
          message: "Appointment slots are now available.",
        };
      }
      const availability = await appointmentModel.find({}).exec();
      res.render("appointment", { availability }); // dashboard rendering
    } catch (error) {
      console.log("Error", error);
      const response = {
        status: "failure",
        message: "Something went wrong. Please contact system adminstrator.",
      };
      const availability = await appointmentModel.find({}).exec();
      res.render("appointment", { response, availability }); // show failure message above form and repopulate field
    }
  };

  //Project

  static examiner_get_controller = async (req, res) => {
    try {
      const appointments = await userModel
        .find({ appointment_id: { $exists: true } })
        .populate("appointment", "date time")
        .exec();
      res.render("examiner", {
        appointments,
      });
    } catch (error) {
      console.log("Error", error);
      const appointments = await userModel
        .find({ appointment_id: { $exists: true } })
        .exec();
      res.render("examiner", { appointments });
    }
  };
  static mark_post_controller = async (req, res) => {
    try {
      let { appointment_id, comment, result } = req.body;
      result = result == "pass";
      // Update the appointment's comment and result
      console.log(appointment_id, comment, result);
      await userModel.updateOne({ _id: appointment_id }, { comment, result });

      req.flash("mark_success", "Driver details updated successfully.");
      res.redirect("/examiner");
    } catch (error) {
      console.log(error);
      req.flash("mark_failure", "Failed to update driver details.");
      res.redirect("/examiner");
    }
  };
  static candidate_get_controller = async (req, res) => {
    try {
      const candidates = await userModel
        .find({ result: { $exists: true } })
        .exec();
      res.render("candidate-list", {
        candidates,
      });
    } catch (error) {
      console.log("Error", error);
      const candidates = await userModel
        .find({ result: { $exists: true } })
        .exec();
      res.render("candidate-list", { candidates });
    }
  };
}

export default Controller;
