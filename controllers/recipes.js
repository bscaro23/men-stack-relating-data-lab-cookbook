const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');


router.get('/', async (req, res) => {

    res.render('recipes/index.ejs');
});

router.get('/my', async (req, res) => {
    const currentUserId = req.session.user._id;

    res.render('recipes/my.ejs', {
        currentUserId: currentUserId,
    });
});

router.get('/new', async (req, res) => {
    res.render('recipes/new.ejs');
});

router.get('/:recipeId', async (req, res) => {
    const recipe = await Recipe.findById(req.params.recipeId).populate('owner').populate('ingredients');
    res.render('recipes/show.ejs', {
        recipe: recipe,
    });
});

router.get('/:recipeId/edit', async (req, res) => {

    const recipe = await Recipe.findById(req.params.recipeId);

    if (recipe.owner.equals(req.session.user._id)) {
        try {
            res.render ('recipes/edit.ejs', {
                recipe: recipe
            });
        } catch (error){
            console.log(error);
            res.redirect('/');
        }
      } else {
        res.send('This is not yours to edit.');
      }
});

router.post('/', async (req, res) => {
    try {
        req.body.owner = req.session.user._id;
        console.log(req.body);
        await Recipe.create(req.body);
        res.redirect('/')

    } catch (error){
        console.log(error);
        res.redirect('/');
    }
});

router.delete('/:recipeId', async (req, res) => {

    const recipe = await Recipe.findById(req.params.recipeId);

    console.log(`recipe owner: ${recipe.owner}, session user: ${req.session.user._id}`);

    if (recipe.owner.equals(req.session.user._id)) {
        try {
            await Recipe.findByIdAndDelete(recipe._id)
            res.redirect(`/users/${req.session._id}/recipes`);
            
        } catch (error){
            console.log(error);
            res.redirect('/');
        }
      } else {
        res.send('This is not yours to delete.');
      }
    
});

router.put('/:recipeId', async (req, res) => {
    const currentRecipe = await Recipe.findById(req.params.recipeId);


    //Is needed otherwise will not update the ingredients if none of the boxes are ticked
    if (!req.body.ingredients){
        req.body.ingredients = [];
    }

    if (currentRecipe.owner.equals(req.session.user._id)) {
        try {
            console.log(req.body);
            await currentRecipe.updateOne(req.body);
            res.redirect(`/users/${req.session._id}/recipes`)
        } catch (error){
            console.log(error);
            res.redirect('/');
        }
      } else {
        res.send('This is not yours to edit.');
      }
});


module.exports = router;