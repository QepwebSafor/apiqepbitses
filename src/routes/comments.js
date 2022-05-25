const { Router } = require('express');
const router = Router();
const {getComments, createComment , getComment, updateComment, deleteComment} = require('../controllers/comments.controller');
const { isAuth, isAdmin } = require('../util');
router.route('/')
    .get(getComments, isAuth, isAdmin) 
    .post(createComment);

router.route('/:id')
    .get(getComment)
    
    .put(updateComment)
 
    .delete (deleteComment);

    module.exports = router;  