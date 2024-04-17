const mongoose = require("mongoose");
let Restaurants = require("../model/restaurant");

module.exports = {
  // Local Strategy
  initialize : (connectionString) => {
    mongoose.connect(connectionString);
    let db = mongoose.connection;
    db.once("open", function () {
        console.log("Connected to MongoDB");
      });
      
      // Check for DB errors
      db.on("error", function (err) {
        console.log("DB Error");
      });
},
getAllRestaurants : (perPage,page,borough,searchString) => {
 return Restaurants.find(borough ? {borough:borough} : {}, searchString ? {name:searchString} : {}).sort('restaurant_id').limit(perPage)
 .skip(perPage * page).lean() 
},
getRestaurantById : (id) => {
  
  return Restaurants.findById(id).lean()
 
 },
 deleteRestaurantById : (id) => {
  
    return Restaurants.findByIdAndDelete(id)
   
   },
 addNewRestaurant: async (data) => {
  try {
      // Check if restaurant with the given ID already exists
      const existingRestaurant = await Restaurants.findOne({ restaurant_id: data.restaurant_id });

      if (existingRestaurant) {
          return { success: false, successForAdd: false, message: 'Restaurant ID already exists in the database' };
      }

      // Format the input data to match the desired structure
     
      const insertData = {
          address: {
              building: data.building,
              coord: [
                      data.longitute,
                      data.latitute
              ],
              street: data.street,
              zipcode: data.zipcode,
          },
          borough: data.borough,
          cuisine: data.cuisine,
          grades: [], 
          name: data.name,
          restaurant_id: data.restaurant_id,
      };

      // Loop through the grade entries in the form
      for (let i = 0; i < data.grades.grade.length; i++) {
          // Check if both grade and score are present for the entry
          if (data.grades.grade[i] && data.grades.score[i]) {
              insertData.grades.push({
                  date: new Date().toISOString(), // Use current date for the example
                  grade: data.grades.grade[i],
                  score: data.grades.score[i],
              });
          }
      }

      // Create a new instance of the Restaurant model with the formatted data
      const newRestaurant = new Restaurants(insertData);

      // Save the new restaurant to the database
      const result = await newRestaurant.save();

      // Return the newly created restaurant
      return { success: true, successForAdd: true, message: 'Restaurant added successfully', result };
  } catch (error) {
      // Log and throw an error if adding new restaurant fails
      console.error(`Error adding new restaurant: ${error.message}`);
      throw { success: false, message: 'Error adding new restaurant' };
  }
}
,
updateRestaurant: async (data) => {
    try {
        // Check if restaurant with the given ID already exists
        const existingRestaurant = await Restaurants.findOne({ restaurant_id: data.restaurant_id });
  
        if (!existingRestaurant) {
            return { success: false, successForAdd: false, message: 'Restaurant ID does not exists in the database' };
        }
  
        // Format the input data to match the desired structure
      
        const insertData = {
            address: {
                building: data.building,
                coord: [
                        data.longitute,
                        data.latitute
                ],
                street: data.street,
                zipcode: data.zipcode,
            },
            borough: data.borough,
            cuisine: data.cuisine,
            grades: data.grade, 
            name: data.name,
            restaurant_id: data.restaurant_id,
        };
  
       
  
        // Save the new restaurant to the database
        const result = await Restaurants.findByIdAndUpdate({_id:data._id}, insertData);
        console.log(result);
        // Return the newly created restaurant
        return { success: true, successForAdd: true, message: 'Restaurant added successfully', result };
    } catch (error) {
        // Log and throw an error if adding new restaurant fails
        console.error(`Error adding new restaurant: ${error.message}`);
        throw { success: false, message: 'Error adding new restaurant' };
    }
  }
}
  
  