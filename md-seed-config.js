var mongoose = require('mongoose');
import Category from './seeders/category.seeder';
const mongoURL = 'mongodb://localhost/hybride';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
    Category,
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
