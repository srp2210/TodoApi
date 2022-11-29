const router = require('express').Router();
const Todo = require('../models/todo');


//list todo
router.get('/', (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  Todo.find()
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .exec((err, todos) => {
      if (err) {
        return res.json({ error: err });
      }
      return res.json({ data: todos });
    });
});


//create todo
router.post('/create', (req, res) => {
  const todo = Todo({
    title: req.body.title,
    content: req.body.content,
  });
  todo.save((err, todo) => {
    if (err) {
      return res.json({ error: err });
    }
    return res.json({ data: todo });
  });
});

//edit todo
router.put('/:id', (req, res) => {
  Todo.findById(req.params.id)
    .exec((err, todo) => {
      if (err) {
        return res.json({ error: err });
      }
      todo.title = req.body.title ?? todo.title;
      todo.content = req.body.content ?? todo.content;
      todo.completed = req.body.completed ?? todo.completed;
      todo.save((err, todo) => {
        if (err) {
          return res.json({ error: err });
        }
        return res.json({ data: todo });
      })
    });
})

//delete todo
router.delete('/:id', (req, res) => {
  Todo.remove({
    _id: req.params.id
  }).exec((err, result) => {
    if (err) {
      return res.json({ error: result });
    }
    if (result.deletedCount == 0) {
      return res.json({ data: 'No todo found with id given' });
    }
    return res.json({ data: 'Deleted successfully' });
  })

});

module.exports = router;