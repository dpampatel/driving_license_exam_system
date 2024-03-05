import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema({
    time: { type: String, required: true },
    date: { type: Date, require: true },
    isTimeSlotAvailable: { type: Boolean, require: true, default: true },
  }),
  appointmentModel = mongoose.model("appointment", appointmentSchema);

export default appointmentModel;
