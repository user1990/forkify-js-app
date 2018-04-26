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
}
