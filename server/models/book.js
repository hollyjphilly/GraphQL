const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: { type: ObjectId, ref: 'authors',required: [true,'No author id found']}
})

module.exports = mongoose.model('Book', bookSchema);