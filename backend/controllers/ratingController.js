const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const Course = require('../models/course');
const Coupon = require('../models/Coupon');

// Nova função: verificar e criar cupom automaticamente
async function checkAndCreateCoupon(userId, courseId) {
  try {
    // Buscar o curso para pegar a plataforma
    const course = await Course.findById(courseId);
    if (!course) return null;

    const platform = course.platform;

    // Buscar todos os cursos desta plataforma
    const platformCourses = await Course.find({ platform }).select('_id');
    const courseIds = platformCourses.map(c => c._id);

    // Contar avaliações não-consumidas desta plataforma pelo usuário
    const eligibleRatings = await Rating.find({
      userId: userId,
      courseId: { $in: courseIds },
      usedForCoupon: false
    }).sort({ createdAt: 1 }); // Mais antigas primeiro

    // Se tem 3 ou mais avaliações, criar cupom
    if (eligibleRatings.length >= 3) {
      // Gerar código único para o cupom
      const timestamp = Date.now().toString().slice(-6);
      const platformPrefix = platform.substring(0, 3).toUpperCase();
      const code = `${platformPrefix}-${timestamp}`;

      // Criar o cupom
      const newCoupon = new Coupon({
        userId: userId,
        platform: platform,
        code: code,
        discount: 10, // 10% de desconto
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
      });
      await newCoupon.save();

      // Marcar as 3 avaliações mais antigas como consumidas
      const ratingsToMark = eligibleRatings.slice(0, 3);
      await Rating.updateMany(
        { _id: { $in: ratingsToMark.map(r => r._id) } },
        { usedForCoupon: true }
      );

      return {
        coupon: newCoupon,
        platform: platform,
        ratingsUsed: ratingsToMark.length
      };
    }

    return null;
  } catch (error) {
    console.error('Erro ao verificar/criar cupom:', error);
    return null;
  }
}

async function updateCourseRating(courseId) {
  // Converter courseId para ObjectId para comparação correta no MongoDB
  const courseObjectId = new mongoose.Types.ObjectId(courseId);
  
  const agg = await Rating.aggregate([
    { $match: { courseId: courseObjectId } },
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

    // Buscar o curso atualizado para retornar ao frontend
    const updatedCourse = await Course.findById(courseId);

    // NOVA LÓGICA: Verificar se usuário ganhou um cupom
    const couponResult = await checkAndCreateCoupon(req.user.id, courseId);

    const response = { 
      message: 'Avaliação criada com sucesso', 
      rating: r, 
      updatedCourse 
    };

    // Se ganhou cupom, incluir na resposta
    if (couponResult) {
      response.couponEarned = {
        message: `🎉 Parabéns! Você ganhou um cupom de ${couponResult.coupon.discount}% para ${couponResult.platform}!`,
        coupon: couponResult.coupon,
        platform: couponResult.platform
      };
    }

    res.status(201).json(response);
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

    // Buscar o curso atualizado para retornar ao frontend
    const updatedCourse = await Course.findById(r.courseId);

    res.json({ message: 'Avaliação atualizada com sucesso', rating: r, updatedCourse });
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
    
    const courseId = r.courseId; // Salvar o courseId antes de deletar
    await Rating.deleteOne({ _id: r._id });
    await updateCourseRating(courseId);
    
    // Buscar o curso atualizado para retornar ao frontend
    const updatedCourse = await Course.findById(courseId);
    
    res.json({ message: 'Avaliação excluída com sucesso', deletedRatingId: r._id, updatedCourse });
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