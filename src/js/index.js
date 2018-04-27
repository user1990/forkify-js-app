import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked Recipes
 */
const state = {};

/*** SEARCH CONTROLER ***/
const controlSearch = async () => {
  // 1. Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2. If query exists create new search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResult);

    try {
      // 4. Search for recipes
      await state.search.getResults();

      // 5. Get results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      console.log('Something went wrong with a search', error);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
  }
});

/*** RECIPE CONTROLER ***/
const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace('#', '');

  if (id) {
    // Prepare UI for cahnges
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data & parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (error) {
      console.log('Error proccesing recipe!', error);
    }
  }
};

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // Increase button is clicked
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));

/*** LIST CONTROLER ***/
const controlList = () => {
  // Create a new list IF there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach(ingredient => {
    const item = state.list.addItem(
      ingredient.count,
      ingredient.unit,
      ingredient.ingredient,
    );
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches('.shopping__count-value')) {
    const value = parseFloat(e.target.value, 10);
    state.list.updateCount(id, value);
  }
});

/*** LIST CONTROLER ***/
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img,
    );

    // Toggle the like button

    // Add like to the UI list
    console.log(state.likes);

    // User has liked current recipe
  } else {
    // Remove like from the state
    state.likes.removeLikes(currentID);

    // Toggle the like button

    // Remove like from the UI list
    console.log(state.likes);
  }
};
