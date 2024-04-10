require('dotenv').config();
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const passport = require("passport");
var methodOverride = require('method-override')
const session = require("express-session");
var user_routes = require("./routes/users");
var restaurant_routes = require("./routes/restaurants");
// Check connection


// Initialize express app
const app = express();
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {},
}));
require("./dbConfig/passport")(passport);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.engine(
  ".hbs",
  
  exphbs.engine({
    extname: ".hbs",
    partialsDir:path.join(__dirname, "views/partials")
    },
    
  )
);
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(express.static("public"));
app.set("/", path.join(__dirname, "views"));

const restaurant = require("./module/restaurant");
restaurant.initialize(process.env.CONNECTIONSTRING);

app.get("*", function(req, res, next){
    res.locals.user = req.user || null;
    next();
})
app.use("/users", user_routes);
app.use("/api", restaurant_routes);

// Add Restaurant

const PORT = process.env.PORT || 8000;

// Listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));