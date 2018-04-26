import axios from 'axios';
import { config } from '../../config/config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const response = await axios(
        `${config.PROXY}${config.API_URL}get?key=${config.API_KEY}&rId=${
          this.id
        }`,
      );
      this.title = response.data.recipe.title;
      this.author = response.data.recipe.publisher;
      this.img = response.data.recipe.image_url;
      this.url = response.data.recipe.source_url;
      this.ingredients = response.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
    }
  }

  calcTime() {
    // Assuming that we need 15 min for each 3 ingredients
    const numberOfIngredients = this.ingredients.length;
    const periods = Math.ceil(numberOfIngredients / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      'tablespoons',
      'tablespoon',
      'ounce',
      'ounces',
      'teaspoon',
      'teaspoons',
      'cups',
      'pounds',
    ];
    const unitsShort = [
      'tbsp',
      'tbsp',
      'oz',
      'oz',
      'tsp',
      'tsp',
      'cup',
      'pound',
    ];

    const newIngredients = this.ingredients.map(el => {
      // Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitsShort[index]);
      });

      // Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // Parse ingredients into count, unit and ingredient
      const arrIngredient = ingredient.split(' ');
      const unitIndex = arrIngredient.findIndex(el2 =>
        unitsShort.includes(el2),
      );

      let objIngredient;
      if (unitIndex > -1) {
        // There is a unit
        // Ex. 4 1/2 cups, arrCount is [4, 1/2]
        // Ex. 4 cups, arrCount is [4]
        const arrCount = arrIngredient.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIngredient[0].replace('-', '+'));
        } else {
          count = eval(arrIngredient.slice(0, unitIndex).join('+'));
        }

        objIngredient = {
          count,
          unit: arrIngredient[unitIndex],
          ingredient: arrIngredient.slice(unitIndex + 1).join(' '),
        };
      } else if (parseInt(arrIngredient[0], 10)) {
        // There is NO unit, but 1st element is number
        objIngredient = {
          count: parseInt(arrIngredient[0], 10),
          unit: '',
          ingredient: arrIngredient.slice(1).join(' '),
        };
      } else if (unitIndex === -1) {
        // There is NO unit & NO number in 1st position
        objIngredient = {
          count: 1,
          unit: '',
          ingredient,
        };
      }
      return objIngredient;
    });
    this.ingredients = newIngredients;
  }
}
