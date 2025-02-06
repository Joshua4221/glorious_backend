import { socketIO } from "../../../index.js";
import ServiceModel from "../models/service_models.js";

export const EmitServices = async () => {
  const findServices = await ServiceModel.find({
    status: "active",
    delete: false,
    deactivate: false,
  }).sort("-date");

  socketIO.emit("services", findServices);
};
