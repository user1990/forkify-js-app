import axios from 'axios';
import { config } from '../../config/config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults(query) {
    // https://food2fork.com/about/api
    try {
      const response = await axios(
        `${config.PROXY}${config.API_URL}search?key=${config.API_KEY}&q=${
          this.query
        }`,
      );
      this.result = response.data.recipes;
    } catch (error) {
      console.log(error);
    }
  }
}
