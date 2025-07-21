const { validationResult } = require('express-validator');
const UserList = require('../models/Userlist');
const Course   = require('../models/course');

exports.getMyList = async (req, res) => {
  try {
    let list = await UserList.findOne({ userId: req.user.id });
    if (!list) {
      list = await UserList.create({ userId: req.user.id, courseIds: [] });
    }
    await list.populate('courseIds');
    res.json({ list, courses: list.courseIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.addCourseToList = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { courseId } = req.body;
    if (!await Course.findById(courseId)) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }
    const list = await UserList.findOneAndUpdate(
      { userId: req.user.id },
      { $addToSet: { courseIds: courseId } },
      { upsert: true, new: true }
    ).populate('courseIds');
    res.json({ message: 'Curso adicionado à lista com sucesso', list, courses: list.courseIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.removeCourseFromList = async (req, res) => {
  try {
    const list = await UserList.findOneAndUpdate(
      { userId: req.user.id },
      { $pull: { courseIds: req.params.courseId } },
      { new: true }
    ).populate('courseIds');
    if (!list) return res.status(404).json({ error: 'Lista não encontrada' });
    res.json({ message: 'Curso removido da lista com sucesso', list, courses: list.courseIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getUserList = async (req, res) => {
  try {
    const list = await UserList.findOne({ userId: req.params.userId }).populate('courseIds');
    if (!list) return res.status(404).json({ error: 'Lista não encontrada' });
    res.json({ list, courses: list.courseIds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
