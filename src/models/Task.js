const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const TaskSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
       
    },
    priority: {
        type: String,
        required: true
       
    },
    date: {
        type: Date,
        default: Date.now
    }
  
});
var Task =mongoose.model('Task', TaskSchema);
module.exports = Task
