const { validationResult } = require('express-validator');
const Course = require('../models/course');

exports.listCourses = async (req, res) => {
  try {
    const { search, platform, sortBy, order = 'asc', page = 1, limit = 12 } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { title:       { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
    if (platform) filter.platform = platform;

    let query = Course.find(filter);
    if (sortBy) query = query.sort({ [sortBy]: order === 'desc' ? -1 : 1 });

    const total = await Course.countDocuments(filter);
    const courses = await query
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    res.json({
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCourses: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso não encontrado' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const course = new Course({
      ...req.body,
      createdBy: req.user.id
    });
    await course.save();
    res.status(201).json({ message: 'Curso criado com sucesso', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.updateCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso não encontrado' });

    if (req.user.role !== 'admin' && course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    Object.assign(course, req.body, { updatedAt: Date.now() });
    await course.save();
    res.json({ message: 'Curso atualizado com sucesso', course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso não encontrado' });

    if (req.user.role !== 'admin' && course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    await course.remove();
    res.json({ message: 'Curso excluído com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.listPlatforms = async (_, res) => {
  try {
    const platforms = await Course.distinct('platform');
    res.json({ platforms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getCoursesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const courses = await Course.find({ createdBy: userId });
    res.json({ courses, total: courses.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
