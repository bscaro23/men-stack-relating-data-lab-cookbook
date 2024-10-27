const User = require('../models/user.js');
const Ingredient = require('../models/ingredient.js');
const Recipe = require('../models/recipe.js');



const fetchRecipes = async (req, res, next) => {
    try {
      res.locals.recipes = await Recipe.find({}).populate('owner');
      res.locals.ingredients = await Ingredient.find({});
      res.locals.users = await User.find({});
      next();
    } catch (error) {
      next(error);
    }
  };

  module.exports = fetchRecipes;
  