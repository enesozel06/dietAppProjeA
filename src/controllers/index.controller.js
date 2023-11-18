const fs = require('fs');

const User = require('../models/User');
const Dietician = require('../models/Dietician');
const Post = require('../models/Post');
const Product = require('../models/Product');
const DietMenu = require('../models/DietMenu');

exports.getIndex = async (req, res) => {
  const posts = await Post.findAll({ include: [User] });
  return res.render('index', { path: '/', posts: posts, isLoggedIn: req.session.isLoggedIn });
};

exports.getCalorieCalcPage = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('login');
  }
  const updatedUser = await User.findOne({ where: { id: user.id } });
  res.render('calorie-calc', { path: '/calorie-calc', user: updatedUser, isLoggedIn: req.session.isLoggedIn });
};

exports.get404 = (req, res) => {
  res.render('404', { path: '/404', isLoggedIn: req.session.isLoggedIn });
};

exports.getDieticiansPage = async (req, res) => {
  const dieticians = await User.findAll({ where: { roleType: 'DIETICIAN' }, include: [Dietician] });
  res.render('dieticians', { path: '/dieticians', dieticians: dieticians, isLoggedIn: req.session.isLoggedIn });
};

exports.getDieticianSinglePage = async (req, res) => {
  const dieticianId = req.params.id;
  const dietician = await User.findOne({ where: { dieticianId: dieticianId }, include: [Dietician] });
  if (!dietician) {
    return res.redirect('dieticians');
  }
  return res.render('dietician-single', { path: '/dieticians', dietician: dietician, isLoggedIn: req.session.isLoggedIn });
};

exports.getCreatePostPage = (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('login');
  }
  res.render('create-post', { path: '/create-post', user, isLoggedIn: req.session.isLoggedIn });
};

exports.getPostSinglePage = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findOne({ where: { id: postId }, include: [User] });
  if (!post) {
    return res.redirect('/');
  }
  return res.render('post-single', { path: '', post: post, isLoggedIn: req.session.isLoggedIn });
};

exports.getDietProgramPage = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('login');
  }
  const dietMenu = await DietMenu.findOne({ where: { userId: user.id } });
  if (dietMenu) {
    const myMenu = [];
    for (let i = 0; i < dietMenu.products.length; i++) {
      const product = await Product.findOne({ where: { id: dietMenu.products[i] } });
      myMenu.push(product);
    }
    const products = await Product.findAll();
    return res.render('diet-program', {
      path: '/diet-program',
      products: products,
      isLoggedIn: req.session.isLoggedIn,
      dailyCalorieIntake: user.dailyCalorieIntake,
      myMenu: myMenu,
    });
  }
  const products = await Product.findAll();
  return res.render('diet-program', {
    path: '/diet-program',
    products: products,
    isLoggedIn: req.session.isLoggedIn,
    dailyCalorieIntake: user.dailyCalorieIntake,
    myMenu: 'empty',
  });
};

exports.postCalorieCalc = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('login');
  }
  const { height, weight, genderType, age } = req.body;
  let dailyCalorieIntake = 0.0;
  if (genderType === 'MALE') {
    dailyCalorieIntake = 66 + 13.7 * parseFloat(weight) + 5 * parseFloat(height) - 6.8 * parseFloat(age);
  } else {
    dailyCalorieIntake = 655 + 9.6 * parseFloat(weight) + 1.8 * parseFloat(height) - 4.7 * parseFloat(age);
  }
  const userForUpdate = await User.findOne({ where: { id: user.id } });
  if (!userForUpdate) {
    return res.redirect('login');
  }
  userForUpdate.dailyCalorieIntake = dailyCalorieIntake.toFixed(2);
  userForUpdate.genderType = genderType;
  userForUpdate.height = height;
  userForUpdate.weight = weight;
  userForUpdate.age = age;
  await userForUpdate.save();
  return res.render('calorie-calc', { path: '/calorie-calc', user: userForUpdate, isLoggedIn: req.session.isLoggedIn });
};

exports.postCreatePost = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('login');
  }

  const uploadDir = 'public/uploads/';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  let uploadedImage = req.files.foto;
  let uploadPath = __dirname + '../../../public/uploads/' + uploadedImage.name;
  const { title, content } = req.body;

  uploadedImage.mv(uploadPath, async () => {
    await Post.create({ title: title, content: content, photo: '/uploads/' + uploadedImage.name, userId: user.id });
    return res.redirect('/');
  });
};

exports.postDietProgram = async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('login');
  }
  if (!req.body.products) {
    await DietMenu.destroy({ where: { userId: user.id } });
    return res.redirect('/diet-program');
  }
  const dietMenu = await DietMenu.findOne({ where: { userId: user.id } });
  if (!dietMenu) {
    const products = req.body.products;
    await DietMenu.create({ userId: req.session.user.id, products: products });
    return res.redirect('/diet-program');
  }
  const products = req.body.products;
  dietMenu.products = products;
  await dietMenu.save();
  res.redirect('/diet-program');
};
