const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Ingredient = require('../models/ingredient.js');

router.get('/', (req, res) => {
    res.render('ingredients/index.ejs');
});

router.get('/new', (req, res) => {
    res.render('ingredients/new.ejs');
});

router.post('/', async (req, res) => {

    const ingredientInDatabase = await Ingredient.findOne({ name: req.body.name });
    if (!ingredientInDatabase){
        try {
            await Ingredient.create(req.body);
            res.redirect(`/users/${req.session._id}/ingredients`);
        }catch (error){
            console.log(error);
            res.redirect('/');
        }
    } else {
        res.send('Ingredient already exists');
    }
});

router.delete('/:ingredientId', async (req, res) => {
    try {
        await Ingredient.findByIdAndDelete(req.params.ingredientId);
        res.redirect(`/users/${req.session._id}/ingredients`);
    }catch(error){
        console.log(error);
        res.redirect('/');
    }
});

module.exports = router;