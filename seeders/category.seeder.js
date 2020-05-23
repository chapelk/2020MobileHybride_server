import { Seeder } from 'mongoose-data-seed';
require('../models/category');
var mongoose = require('mongoose');
var Model = mongoose.model('Category');

const data = [
  {
    name: "Livres",
    apiId: 1
  },
  {
    name: "Jeux-vidéo",
    apiId: 2
  },
];

class CategorySeeder extends Seeder {

  async shouldRun() {
    return Model.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return Model.create(data);
  }
}

export default CategorySeeder;
