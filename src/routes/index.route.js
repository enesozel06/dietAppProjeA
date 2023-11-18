const router = require('express').Router();

const indexController = require('../controllers/index.controller.js');
const authController = require('../controllers/auth.controller.js');

/** Get */
router.get('/', indexController.getIndex);

router.get('/login', authController.getLogin);

router.get('/register', authController.getRegister);

router.get('/calorie-calc', indexController.getCalorieCalcPage);

router.get('/dieticians', indexController.getDieticiansPage);

router.get('/dieticians/:id', indexController.getDieticianSinglePage);

router.get('/create-post', indexController.getCreatePostPage);

router.get('/posts/:id', indexController.getPostSinglePage);

router.get('/diet-program', indexController.getDietProgramPage);

router.get('*', indexController.get404);

/** Post */
router.post('/register', authController.postRegister);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.post('/create-post', indexController.postCreatePost);

router.post('/calorie-calc', indexController.postCalorieCalc);

router.post('/diet-program', indexController.postDietProgram);

module.exports = router;
