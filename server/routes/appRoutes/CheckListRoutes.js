import express from "express";
import {
  getAllCheckList,
  createCheckList,
  getCheckList,
  updateCheckList,
  deleteCheckList,
} from "../../controllers/appControllers/CheckListController.js";

const router = express.Router();

router.route("/").get(getAllCheckList).post(createCheckList);

router
  .route("/:id")
  .get(getCheckList)
  .patch(updateCheckList)
  .delete(deleteCheckList);

export default router;
