import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoupons, deleteCoupon } from '../store/couponSlice';
import { Link, useNavigate } from 'react-router-dom';
import CouponForm from './CouponForm';

const CouponList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coupons, status, error } = useSelector((state) => state.coupons);
  const { courses } = useSelector((state) => state.courses);
  const user = useSelector((state) => state.auth.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (status === 'idle') {
      setIsLoading(true);
      dispatch(fetchCoupons(user.id))
        .unwrap()
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, navigate, status, user]);

  const handleDeleteCoupon = async (id) => {
    try {
      await dispatch(deleteCoupon(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete coupon:', error);
    }
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.id === courseId) || { title: 'Curso Desconhecido' };
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="text-red-500 p-4 text-center">
        Erro: {error || 'Falha ao carregar cupons'}
      </div>
    );
  }

  // Ensure coupons is an array before mapping
  const couponList = Array.isArray(coupons) ? coupons : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Seus Cupons</h1>
        {user.role === 'moderator' && (
          <button
            onClick={() => setShowCouponForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Criar Cupom
          </button>
        )}
      </div>

      {/* Coupon Form Modal */}
      {showCouponForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <CouponForm 
              onCancel={() => setShowCouponForm(false)} 
              onSuccess={() => {
                setShowCouponForm(false);
                dispatch(fetchCoupons(user.id));
              }}
            />
          </div>
        </div>
      )}

      {couponList.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum cupom encontrado</h3>
          <p className="mt-1 text-gray-500">Você ainda não tem nenhum cupom.</p>
          <div className="mt-6">
            {user.role === 'moderator' && (
              <button
                onClick={() => setShowCouponForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                Crie Seu Primeiro Cupom
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {couponList.map((coupon) => {
            const course = getCourseById(coupon.courseId);
            const isExpired = new Date(coupon.expiresAt) < new Date();
            return (
              <div
                key={coupon.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                  isExpired ? 'opacity-60' : ''
                }`}
              >
                <div className={`p-1 text-center text-white font-semibold ${isExpired ? 'bg-gray-500' : 'bg-green-500'}`}>
                  {isExpired ? 'Expirado' : 'Ativo'}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h2>
                  <div className="mt-4 text-center">
                    <div className="bg-gray-100 py-3 px-4 rounded-lg text-center">
                      <p className="text-sm text-gray-600 mb-1">Código do Cupom</p>
                      <div className="flex items-center justify-center">
                        <code className="text-lg font-bold text-purple-600 mr-2">{coupon.code}</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(coupon.code);
                            alert('Código do cupom copiado para a área de transferência!');
                          }}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          title="Copiar para a área de transferência"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-gray-600">Desconto:</span>
                      <span className="font-semibold text-green-600 ml-1">{coupon.discount}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expira:</span>
                      <span className={`font-semibold ml-1 ${isExpired ? 'text-red-600' : 'text-gray-800'}`}>
                        {new Date(coupon.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Link
                      to={`/courses/${coupon.courseId}`}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Ver Curso
                    </Link>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
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

export default CouponList;