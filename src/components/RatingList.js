import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRatings, fetchRatingsByUser, deleteRating } from '../store/ratingSlice';
import { Link, useNavigate } from 'react-router-dom';
import RatingForm from './RatingForm';

const RatingList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ratings, status, error } = useSelector(state => state.ratings);
  const courses = useSelector(state => state.courses.courses);
  const user = useSelector(state => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Use user._id instead of user.id
        await dispatch(fetchRatingsByUser(user._id)).unwrap();
      } catch (err) {
        console.error('Erro ao carregar:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [dispatch, navigate, user]);

  const handleDelete = async id => {
    try {
      await dispatch(deleteRating(id)).unwrap();
      await dispatch(fetchRatings()).unwrap();
    } catch (err) {
      console.error('Falha ao excluir avaliação', err);
      alert('Falha ao excluir avaliação');
    }
  };

  const handleAddSuccess = async () => {
    try {
      await dispatch(fetchRatingsByUser(user._id)).unwrap();
    } catch (err) {
      console.error('Erro ao atualizar:', err);
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
          {ratings.map(r => (
            <div
              key={r._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {courses.find(c => c._id === r.courseId)?.title || 'Curso Desconhecido'}
              </h2>
              <div className="mb-2">
                <span className="text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < r.rating ? '★' : '☆'}</span>
                  ))}
                </span>
              </div>
              {r.review && <p className="mb-4 text-gray-700 italic">"{r.review}"</p>}
              <div className="flex justify-between items-center">
                <small className="text-gray-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </small>
                <Link
                  to={`/courses/${r.courseId}`}
                  className="text-purple-600 hover:text-purple-800 text-sm"
                >
                  Ver Curso
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RatingList;