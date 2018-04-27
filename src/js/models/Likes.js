import uniqid from 'uniqid';

export default class Likes {
  constructor() {
    this.likes = [];
  }

  addLike(id, title, author, img) {
    const like = {
      id: uniqid(),
      title,
      author,
      img,
    };
    this.likes.push(like);
    return like;
  }

  deleteLike(id) {
    const index = this.likes.findIndex(like => like.id === id);
    return this.likes.splice(index, 1);
  }

  isLiked(id) {
    return this.likes.findIndex(like => like.id === id) !== -1;
  }

  getNumberOfLikes() {
    return this.likes.length;
  }
}
