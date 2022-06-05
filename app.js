const path = require('path');
const express = require('express');
const postRoutes = require('./routes/post');
const db = require('./database')

const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static('public')); // Serve static files (e.g. CSS files)

app.use(postRoutes);

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render('500');
});

/* webSoket code */
db.connectToDatabase().then(function(){
  app.listen(3000);
}); //db가 있을 때만 서버가 켜지게끔 조절


