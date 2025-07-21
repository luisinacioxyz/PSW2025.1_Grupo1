const { validationResult } = require('express-validator');
const Rating = require('../models/Rating');
const Course = require('../models/course');

async function updateCourseRating(courseId) {
  const agg = await Rating.aggregate([
    { $match: { courseId: courseId } },
    { $group: { _id: '$courseId', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const CourseModel = require('../models/course');
  if (agg.length) {
    await CourseModel.findByIdAndUpdate(courseId, {
      rating:     agg[0].avg,
      totalRatings: agg[0].count
    });
  } else {
    await CourseModel.findByIdAndUpdate(courseId, { rating: 0, totalRatings: 0 });
  }
}

exports.getAllRatings = async (req, res) => {
  try {
    const { courseId, userId, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (courseId) filter.courseId = courseId;
    if (userId)   filter.userId   = userId;

    const total = await Rating.countDocuments(filter);
    const ratings = await Rating.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRatings: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getRatingById = async (req, res) => {
  try {
    const rating = await Rating.findById(req.params.id);
    if (!rating) return res.status(404).json({ error: 'Avaliação não encontrada' });
    res.json(rating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.createRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { courseId, rating, review } = req.body;
  try {
    if (!await Course.findById(courseId)) {
      return res.status(404).json({ error: 'Curso não encontrado' });
    }
    if (await Rating.findOne({ courseId, userId: req.user.id })) {
      return res.status(400).json({ error: 'Você já avaliou este curso' });
    }

    const r = new Rating({ courseId, userId: req.user.id, rating, review });
    await r.save();
    await updateCourseRating(courseId);

    res.status(201).json({ message: 'Avaliação criada com sucesso', rating: r });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.updateRating = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const r = await Rating.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Avaliação não encontrada' });
    if (req.user.role !== 'admin' && r.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    Object.assign(r, req.body, { updatedAt: Date.now() });
    await r.save();
    await updateCourseRating(r.courseId);

    res.json({ message: 'Avaliação atualizada com sucesso', rating: r });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const r = await Rating.findById(req.params.id);
    if (!r) return res.status(404).json({ error: 'Avaliação não encontrada' });
    if (req.user.role !== 'admin' && r.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    await Rating.deleteOne({ _id: r._id });
    await updateCourseRating(r.courseId);
    res.json({ message: 'Avaliação excluída com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getRatingsByCourse = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Rating.countDocuments({ courseId: req.params.courseId });
    const ratings = await Rating.find({ courseId: req.params.courseId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json({
      ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRatings: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.getRatingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const { page = 1, limit = 10 } = req.query;
    const total = await Rating.countDocuments({ userId });
    const ratings = await Rating.find({ userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      ratings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRatings: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};