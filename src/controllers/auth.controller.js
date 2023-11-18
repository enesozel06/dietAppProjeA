const fs = require('fs');

const User = require('../models/User');
const Dietician = require('../models/Dietician');

exports.getRegister = async (req, res) => {
  res.render('register', { path: '/register', isLoggedIn: req.session.isLoggedIn });
};

exports.getLogin = async (req, res) => {
  res.render('login', { path: '/login', isLoggedIn: req.session.isLoggedIn });
};

exports.postRegister = async (req, res) => {
  try {
    const uploadDir = 'public/uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    let uploadedImage = req.files.profilePicture;
    let uploadPath = __dirname + '../../../public/uploads/' + uploadedImage.name;
    uploadedImage.mv(uploadPath);

    const data = req.body;
    if (data.roleType === 'USER') {
      let dailyCalorieIntake = 0;
      if (data.genderType === 'MALE') {
        dailyCalorieIntake = 66 + 13.7 * data.weight + 5 * data.height - 6.8 * data.age;
      } else {
        dailyCalorieIntake = 655 + 9.6 * data.weight + 1.8 * data.height - 4.7 * data.age;
      }
      await User.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        roleType: data.roleType,
        height: data.height,
        weight: data.weight,
        gender: data.genderType,
        age: data.age,
        dailyCalorieIntake: dailyCalorieIntake.toFixed(2),
        profilePicture: '/uploads/' + uploadedImage.name,
      });
      return res.redirect('login');
    }
    if (data.roleType === 'DIETICIAN') {
      const dietician = await Dietician.create({
        resume: data.resume,
        price: data.price,
      });
      await User.create({
        dieticianId: dietician.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        roleType: data.roleType,
        gender: data.genderType,
        age: data.age,
        height: 0,
        weight: 0,
        dailyCalorieIntake: 0,
        profilePicture: '/uploads/' + uploadedImage.name,
      });
      return res.redirect('login');
    }
    return res.redirect('register');
  } catch (error) {
    console.error(error);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    User.findOne({
      where: { email },
    }).then((user) => {
      if (!user) {
        return res.redirect('/login');
      }
      if (user.password !== password) {
        return res.redirect('/login');
      }
      req.session.user = user;
      req.session.isLoggedIn = true;
      return res.redirect('/');
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    req.isLoggedIn = false;
    res.redirect('login');
  });
};
