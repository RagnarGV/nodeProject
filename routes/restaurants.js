const express = require("express");
const router = express.Router();
const restaurant = require("../module/restaurant");
const { check, validationResult } = require("express-validator");
router
.route("/restaurant")
.get(async function (req, res) {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;
    const borough = req.query.borough;
    const searchString = req.query.searchString;
        restaurant.getAllRestaurants(perPage,page,borough,searchString) 
      .then((restaurant) => {
          if (!restaurant || restaurant.length === 0) {
              res.send("No books found");
          } else {
              // Pass books to index
            
              res.render('index', {
                  content: restaurant
              });
          }
      })
      .catch((err) => {
          console.error("Error occurred:", err);
          res.status(500).send("Internal Server Error");
      }) 
   

})
.post(ensureAuthenticated, function(req,res){
    let result = restaurant.addNewRestaurant(req.body)
    console.log(result);
    if (!result) {
      // Log error if failed
      res.send("Could not save book")
    } else {
      // Route to home to view books if suceeeded
      res.redirect("/api/restaurant?perPage=5&page=1");
    }
})


router.get("/restaurant/add",ensureAuthenticated, (req, res) => {
    // Render page with list of genres
    res.render("addRestaurant");
  })

router.route("/restaurant/:p_id")
.get( async function (req, res) {
    const id = req.params.p_id;
  
    restaurant.getRestaurantById(id)
      .then((restaurant) => {
          if (!restaurant || restaurant.length === 0) {
              res.send("No books found");
          } else {
              // Pass books to index
              console.log(id);
              res.render('single', {
                  content: restaurant
              });
          }
      })
      .catch((err) => {
          console.error("Error occurred:", err);
          res.status(500).send("Internal Server Error");
      });
   
})
.put(async function(req,res){

  let result = await restaurant.updateRestaurant(req.body)

  if (!result) {
    // Log error if failed
    res.send("Could not save book")
  } else {
    // Route to home to view books if suceeeded
    res.redirect("/api/restaurant?perPage=5&page=1");
  }
})
.delete(ensureAuthenticated, async function (req, res) {
    const id = req.params.p_id;
    console.log(id);
    await check("p_id", "id is required").notEmpty().run(req);
    const errors = validationResult(req);

    if (errors.isEmpty()) {
    restaurant.deleteRestaurantById(id)
      .then((restaurant) => {
          if (!restaurant || restaurant.length === 0) {
              res.send("No books found");
          } else {
              // Pass books to index
             console.log(restaurant);
              res.redirect("/api/restaurant?perPage=5&page=1");
          }
      })
      .catch((err) => {
          console.error("Error occurred:", err);
          res.status(500).send("Internal Server Error");
      });
    }
    else{
        res.render("index", {
            errors: errors.array(),
          });
    }
})

router.route("/restaurant/update/:p_id")
.get(ensureAuthenticated,function (req, res) {
    const id = req.params.p_id;
  
    restaurant.getRestaurantById(id)
      .then((restaurant) => {
          if (!restaurant || restaurant.length === 0) {
              res.send("No books found");
          } else {
              // Pass books to index
              console.log(restaurant);
              res.render('updateRestaurant', {
                  url:"/api/restaurant/" + restaurant._id+"?_method=PUT",
                  content: restaurant
              });
          }
      })
      .catch((err) => {
          console.error("Error occurred:", err);
          res.status(500).send("Internal Server Error");
      });
})


function ensureAuthenticated(req, res, next) {
    // If logged in proceed to next middleware
    if (req.isAuthenticated()) {
      return next();
      // Otherwise redirect to login page
    } else {
      res.redirect("/users/login");
    }
  }

module.exports = router;
