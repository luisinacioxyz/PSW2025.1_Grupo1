import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRatings, deleteRating } from '../store/ratingSlice';
import { addCoupon, fetchCoupons } from '../store/couponSlice';
import { Link, useNavigate } from 'react-router-dom';
import RatingForm from './RatingForm';

const RatingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { ratings, status, error } = useSelector(state => state.ratings);
  const { coupons } = useSelector(state => state.coupons);
  const courses = useSelector(state => state.courses.courses);
  const user = useSelector(state => state.user.currentUser);

  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const getCourseTitle = id => {
    const found = courses.find(c => c.id === id);
    return found ? found.title : 'Curso Desconhecido';
  };

  const getCoursePrice = id => {
    const found = courses.find(c => c.id === id);
    return found && typeof found.price === 'number' ? found.price : 0;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    dispatch(fetchRatings(user.id))
      .unwrap()
      .finally(() => setIsLoading(false));
    dispatch(fetchCoupons(user.id));
  }, [dispatch, navigate, user]);

  const handleDelete = async id => {
    try {
      await dispatch(deleteRating(id)).unwrap();
      dispatch(fetchRatings(user.id));
    } catch (err) {
      console.error('Falha ao excluir avaliação', err);
      alert('Falha ao excluir avaliação');
    }
  };

  const handleAddSuccess = async () => {
    const updated = await dispatch(fetchRatings(user.id)).unwrap();
    if (updated.length > 0 && updated.length % 5 === 0) {
      const code = `PROMO10-${Date.now().toString().slice(-5)}`;
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const couponPayload = {
        userId: user.id,
        courseId: null,
        code,
        discount: 10,
        expiresAt
      };
      try {
        await dispatch(addCoupon(couponPayload)).unwrap();
        dispatch(fetchCoupons(user.id));
        alert('🎉 Parabéns! Você ganhou um cupom de 10%');
      } catch (err) {
        console.error('Falha ao criar cupom automático', err);
      }
    }
  };

  if (!user) return null;

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-red-500 p-4 text-center">
        Erro: {error || 'Falha ao carregar avaliações'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Suas Avaliações</h1>
      </div>

      {/* Modal de Nova Avaliação */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <RatingForm
              onCancel={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
                handleAddSuccess();
              }}
            />
          </div>
        </div>
      )}

      {/* Lista de Avaliações */}
      {ratings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Nenhuma avaliação encontrada
          </h3>
          <p className="mt-1 text-gray-500">
            Você ainda não avaliou nenhum curso.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ratings.map(r => {
            const price = getCoursePrice(r.courseId);
            return (
              <div
                key={r.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                  {getCourseTitle(r.courseId)}
                </h2>
                <p className="mb-2">
                  Nota: <strong>{r.rating}</strong>
                </p>
                {r.review && (
                  <p className="mb-4 text-gray-700">"{r.review}"</p>
                )}
                <small className="text-gray-500">
                  Avaliado em {new Date(r.createdAt).toLocaleDateString()}
                </small>

                {/* Detalhes e preço */}
                <div className="px-4 pb-4 flex justify-between items-center">
                  <span className="text-purple-600 font-bold text-xl">
                  </span>
                  <div className="flex space-x-2">
                    <Link
                      to={`/courses/${r.courseId}`}
                      className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Detalhes
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RatingList;