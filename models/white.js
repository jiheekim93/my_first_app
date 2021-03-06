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
  tasteNote: [String]
});

const White = mongoose.model('White', wineSchema);

module.exports = White
