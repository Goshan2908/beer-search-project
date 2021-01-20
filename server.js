const express = require("express");
const fetch = require('node-fetch')
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const Beeradd = require("./models/beerr");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const { response } = require("express");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
mongoose.connect("mongodb://localhost:27017/beer", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(
  session({
    secret: "errere33343rerer",
    store: new MongoStore({
      mongooseConnection: mongoose.createConnection(
        "mongodb://localhost:27017/beer",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        }
      ),
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.id = req.session._id;
  next();
});
app.get("/",  (req, res) => {
  res.render("mainpage");
});


app.get("/user/logup", (req, res) => {
  res.render("logup");
});



app.get("/user/login", (req, res) => {
  res.render("login");
});

app.post("/user/logup", async (req, res) => {
  const { email, password, username } = req.body;
  const user = new User({ email, password, username });
  await user.save();
  req.session.username = username;
  res.redirect("/");
});

app.get("/user/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.post("/user/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  
  if (user) {
    if (password === user.password) {
      req.session.username = username;
    } else {
      return res.send("incorrect pass");
    }
  } else {
    return res.send("unknown user");
  }
  res.redirect("/");
});



app.get('/randombeer', async(req, res) => {
  const api = await fetch("https://api.punkapi.com/v2/beers/random");
  let response = await api.json();
  response = response[0]
  console.log(response);
  
  res.render("randombeer", { response });
})



app.post("/user/addbeer", async (req, res) => {
 
  const { beername, imagebeer, abv, food } = req.body;
 
const beeradd = new Beeradd({ name: beername, imagebeer, abv, food, user: req.session.username });
   
 await beeradd.save();
  // res.redirect('randombeer')
  res.json({status:'ok'})
});

app.get("/user/personal", async (req, res) => {
  const user = req.session.username;
  
  
  const addedbeer = await Beeradd.find({ user });
  
    res.render("personal", { addedbeer });
});

app.post("/user/deletepost/:id", async (req, res) => {
 
 await Beeradd.deleteOne({ _id: req.params.id });
 res.redirect('/user/personal')
});

app.get("/selectbeer", (req, res) => {
  res.render("selectbeer");
});

app.get("/searchbeer", (req, res) => {
  res.render("searchbeer");
});


app.post("/user/searchbeer", async (req, res) => {
  
  const food = req.body.foodname;
  const food1 = req.body.foodname1;
  if (food) {
    const api = await fetch(
    `https://api.punkapi.com/v2/beers?food=${food}`
  );
  let response = await api.json();
    res.render("searchbeer", { response });
  } else if (food1) {
    const api = await fetch(
    `https://api.punkapi.com/v2/beers?beer_name=${food1}`
  );
  let response = await api.json();
    res.render("searchbeer", { response });
  }
  
   
});






 app.listen(3003);
