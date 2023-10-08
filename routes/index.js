const express = require('express')
var router = express.Router();
var recipesData = require('../recipes.json')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('<p>HTML Data</p>');
  });

router.get('/recipes', function(req, res, next) {
    var page = req.query.page || 1;
    var limit = req.query.limit || 3;
  
    // Create a copy of the recipes array to avoid modifying the original
    var recipesCopy = [...recipesData];
  
    let result = recipesCopy.slice((page - 1) * limit, page * limit);
  
    if (!result || !result.length) {
      result = [];
    }
  
    res.status(200).json(result);
});

router.get('/recipes/shopping-list', function(req, res, next) {
    const ids = req.query.ids;
  
    // Check if 'ids' query parameter is missing or empty
    if (!ids || ids.trim() === '') {
      return res.status(400).json({ error: 'No ids provided in query' });
    }
    const idArray = ids.split(',');
    let result = [];
    recipesData.forEach(element => {
      if (idArray.includes((element.id).toString())) {
        result.push(...element.ingredients);
      }
    });
  
    // Check if no matching ingredients found
    if (result.length === 0) {
      return res.status(404).json({ error: 'No matching ingredients found' });
    }
  
    // Send the shopping list as a response
    res.status(200).json(result);
  });

module.exports = router;