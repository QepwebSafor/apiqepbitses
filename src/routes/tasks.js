const express = require("express");
const router = express.Router();
const expressAsyncHandler = require('express-async-handler');
const { check, validationResult } = require("express-validator");
const { generateToken, isAdmin, isAuth } = require('../util.js');
const User = require('../models/userModel');
const Task = require("../models/Task");

// @route       GET /api/tasks
router.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: 'Task Not Found' });
    }
  })
);
// @access      Private
router.get("/user/:id",   async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.params.id }).sort({
      date: -1,
    
    });

    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route       POST /api/tasks
// @desc        Add new task
// @access      Private
router.post(
  "/",
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description,  priority,  user, date} = req.body;

    try {
      const newTask = new Task({
        title,
        description,
        priority,
        user,
        date
        
      });

      const task = await newTask.save();

      res.json(task);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);
// @route       PUT /api/tasks/:id
// @desc        Update task
// @access      Private
/* router.put("/:id", isAuth,  async (req, res) => {
  const { title, description ,  priority, date, user} = req.body;
  const taskFields = {};
 
  if (title) taskFields.title = ;
  if (description) taskFields.description = description;
  if (priority) taskFields.priority = priority;
  if (date) taskFields.date = date;
  if (user) taskFields.user = user;
  try {
     
 let  task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: taskFields },
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: "Task not found" });
    res.json(task);
   
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
}); */
router.put(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const task = await Task.findById(req.task._id);
    if (user) {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.priority = req.body.priority || task.priority;
      task.date = req.body.date || task.date;
      task.user = req.body.user || task.user;
  
      const updatedTask = await task.save();
      res.send({
        _id: task._id,
        title: updatedTask.title,
        desription: updatedTask.desription,
        date: updatedTask.date,
        user: updatedTask.user,
      });
    }
  })
);
/* router.get('/:id',  async (req, res) => {
  
    const task = await Task.findById(req.params.id);
    res.json(task );
}; */

// @route       DELETE /api/tasks/:id
// @desc        Delete task
// @access      Private
router.delete("/:id", async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    await Task.findByIdAndRemove(req.params.id);
    res.json({ msg: "Task removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
