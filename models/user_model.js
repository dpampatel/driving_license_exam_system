import mongoose from "mongoose";
const uri =
  "mongodb+srv://<username>:<password>@cluster0.axpuuar.mongodb.net/usersDB?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("------------------ Connected to Mongodb ------------------");
  })
  .catch((error) => {
    console.log("Not connected to Mongo Db" + error);
  });

const userSchema = mongoose.Schema({
    firstname: { type: String, required: true, default: "default" },
    lastname: { type: String, required: true, default: "default" },
    license: { type: String, required: true, default: "default" },
    age: { type: Number, required: true, default: 0 },
    dob: { type: Date, require: true, default: Date.now },
    username: { type: String, required: true },
    password: { type: String, required: true },
    usertype: { type: String, required: true },
    car_details: {
      make: { type: String, required: true, default: "default" },
      model: { type: String, required: true, default: "default" },
      year: { type: Number, required: true, default: 0 },
      platno: { type: String, required: true, default: "default" },
    },
    appointment_id: { type: String },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "appointment" },
    // Project fields
    test_type: { type: String },
    comment: { type: String },
    result: { type: Boolean },
  }),
  userModel = mongoose.model("user", userSchema);

export default userModel;
