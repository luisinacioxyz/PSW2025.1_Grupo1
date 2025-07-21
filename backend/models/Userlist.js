// models/UserList.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userListSchema = new Schema({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseIds: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

module.exports = mongoose.model('UserList', userListSchema);
