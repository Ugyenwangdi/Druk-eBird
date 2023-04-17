import express from 'express';

import { 
  registerUser, loginUser, getAllUsers, getUserInfoByID,  
} from '../controllers/user.controller.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/:id').get(getUserInfoByID);

export default router;