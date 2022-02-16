const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wineSchema = new Schema({
  number: String,
  name: String,
  image: String,
  vineyard: String,
  type: [String],
  year: String,
  price: String,
  tasteNote: [String],
  auctionable: [String]
});

const Rose = mongoose.model('Rose', wineSchema);

module.exports = Rose
