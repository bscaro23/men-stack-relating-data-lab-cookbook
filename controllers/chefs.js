const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const session = require('express-session');

router.get('/', (req, res) => {
    res.render('chefs/index.ejs');
});

router.get('/:chefId', async (req, res) => {
    try{
        const currentRecipes = await Recipe.find({owner: req.params.chefId}).populate('owner');
        res.render('chefs/recipes.ejs', {
            currentRecipes: currentRecipes
        })
    }catch(error){
        console.log(error);
        res.redirect('/');
    }
    
});

module.exports = router;