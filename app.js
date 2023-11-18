const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const sequelize = require('./src/configs/database');
const routes = require('./src/routes/index');
const initAssociations = require('./src/models/index');
const initFakeData = require('./src/configs/fakeData');

const app = express();
const PORT = process.env.PORT || 3000;

/** Template Engine */
app.set('view engine', 'ejs');
app.set('views', './src/views');

/** Middlewares */
app.use(express.static('public'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(fileUpload());
app.use(
  session({
    secret: 'gizliAnahtar',
    resave: false,
    saveUninitialized: true,
  })
);

/** Associations */
initAssociations();

/** Routes */
routes(app);

sequelize.sync({ force: false }).then(() => {
  console.log('Database connected!');
  /** Fake Data */
  //  initFakeData();
  /** Server */
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
