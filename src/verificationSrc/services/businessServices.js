import BusinessModel from "../models/businessverifcation_model.js";
import DocumentModel from "../models/documentverification_model.js";
import FaceModel from "../models/faceVerification_model.js";

export default class BusinessServicesController {
  async CreateBusinessVerification(payload) {
    try {
      const user = await BusinessModel.create({ ...payload });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async fineVerification(payload) {
    try {
      const user = await BusinessModel.find({
        $or: [{ email: payload?.email }, { verify_by: payload?.userId }],
      });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async CreateDocumentVerification(payload) {
    try {
      const user = await DocumentModel.create({ ...payload });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async fineDocumentVerification(payload) {
    try {
      const user = await DocumentModel.find({
        $or: [{ email: payload?.email }, { verify_by: payload?.userId }],
      });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async CreateFaceVerification(payload) {
    try {
      const user = await FaceModel.create({ ...payload });

      return user;
    } catch (err) {
      throw err;
    }
  }

  async fineFaceVerification(payload) {
    try {
      const user = await FaceModel.find({
        $or: [{ email: payload?.email }, { verify_by: payload?.userId }],
      });

      return user;
    } catch (err) {
      throw err;
    }
  }
}
