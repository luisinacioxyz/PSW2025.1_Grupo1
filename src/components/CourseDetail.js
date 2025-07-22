import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, deleteCourse } from '../store/courseSlice';
import { fetchRatings, addRating, deleteRating } from '../store/ratingSlice';
import { addCourseToList, removeCourseFromList, fetchUserList } from '../store/userListSlice';
import RatingForm from './RatingForm';
import CouponForm from './CouponForm';
import CourseForm from './CourseForm';

const CourseDetail = () => {
  const { id } = useParams();
  const courseId = id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { courses, status: coursesStatus } = useSelector((state) => state.courses);
  const { ratings, status: ratingStatus } = useSelector((state) => state.ratings);
  const user = useSelector((state) => state.auth.user);
  const { userList, status: userListStatus } = useSelector((state) => state.userList);
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const [removingFromList, setRemovingFromList] = useState(false);
  const [editingCourse, setEditingCourse] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // If courses haven't been loaded, fetch them
    if (coursesStatus === 'idle') {
      dispatch(fetchCourses());
    }

    // Load user list if user is authenticated
    if (user && userListStatus === 'idle') {
      dispatch(fetchUserList());
    }

    const selectedCourse = courses.find((c) => c._id === courseId);
    if (selectedCourse) {
      setCourse(selectedCourse);
      dispatch(fetchRatings(courseId));
      setIsLoading(false);
    } else if (coursesStatus === 'succeeded') {
      // If courses are loaded but we can't find this course, it might not exist
      setIsLoading(false);
    }
  }, [courseId, courses, coursesStatus, dispatch, user, userListStatus]);

  const handleAddRating = async (ratingData) => {
    if (!user) return;
    
    try {
      const response = await dispatch(addRating({
        courseId,
        userId: user.id,
        ...ratingData
      })).unwrap();
      
      setShowRatingForm(false);
      
      // Verificar se o usuário ganhou um cupom
      if (response.couponEarned) {
        alert(response.couponEarned.message);
      }
    } catch (error) {
      console.error('Failed to add rating:', error);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    if (!user) return;
    
    try {
      await dispatch(deleteRating(ratingId)).unwrap();
    } catch (error) {
      console.error('Failed to delete rating:', error);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      await dispatch(deleteCourse(courseId)).unwrap();
      setShowDeleteConfirm(false);
      navigate('/courses');
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
    }
  };

  const canManageCourse = () => {
    return user && user.role === 'admin';
  };

  const isInUserList = userList && userList.courseIds && userList.courseIds.some(course => course._id === courseId);

  const handleAddToList = async () => {
    if (!user || !userList || addingToList) return;
    
    try {
      setAddingToList(true);
      
      // Use the addCourseToList thunk
      await dispatch(addCourseToList(courseId)).unwrap();
      
      console.log('Course added to list successfully');
    } catch (error) {
      console.error('Failed to add course to list:', error);
    } finally {
      setAddingToList(false);
    }
  };

  const handleRemoveFromList = async () => {
    if (!user || !userList || removingFromList) return;
    
    try {
      setRemovingFromList(true);
      
      // Use the removeCourseFromList thunk
      await dispatch(removeCourseFromList(courseId)).unwrap();
      
      console.log('Course removed from list successfully');
    } catch (error) {
      console.error('Failed to remove course from list:', error);
    } finally {
      setRemovingFromList(false);
    }
  };

  if (isLoading || coursesStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/courses" className="text-purple-600 hover:text-purple-800 flex items-center mb-6">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Voltar aos Cursos
        </Link>
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-700">Curso Não Encontrado</h2>
          <p className="mt-2 text-gray-600">O curso que você está procurando não existe ou foi removido.</p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Informação de depuração: Procurando curso com ID: {courseId}</p>
            <p className="text-sm text-gray-500">Cursos disponíveis: {courses.length}</p>
            <p className="text-sm text-gray-500">Status de carregamento: {coursesStatus}</p>
          </div>
        </div>
      </div>
    );
  }

  const userHasRated = user && ratings.some(rating => rating.userId === user.id);

  if (editingCourse) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <button
              onClick={() => setEditingCourse(false)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar para detalhes
            </button>
          </div>
          <CourseForm course={course} onCancel={() => setEditingCourse(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/courses" className="text-purple-600 hover:text-purple-800 flex items-center mb-6">
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Voltar aos Cursos
      </Link>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img 
              src={course.imageUrl} 
              alt={course.title} 
              className="h-48 w-full object-cover md:w-48"
            />
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-start">
              <div>
                <div className="uppercase tracking-wide text-sm text-purple-600 font-semibold">
                  {course.platform}
                </div>
                <h1 className="mt-1 text-3xl font-bold text-gray-900">{course.title}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-purple-600">R${course.price.toFixed(2)}</div>
                {canManageCourse() && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCourse(true)}
                      className="text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-red-600 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <p className="mt-4 text-gray-600">{course.description}</p>
            
            <div className="mt-6 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(course.rating || 0)
                        ? 'text-yellow-400'
                        : i < (course.rating || 0)
                        ? 'text-yellow-300'
                        : 'text-gray-300'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {course.rating ? course.rating.toFixed(1) : '0.0'} ({course.totalRatings || 0} avaliações)
              </span>
            </div>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <a 
                href={course.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Visitar Curso
              </a>
              
              {user && (
                <>
                  {isInUserList ? (
                    <button 
                      onClick={handleRemoveFromList}
                      disabled={removingFromList || userListStatus === 'loading'}
                      className="bg-white hover:bg-gray-100 text-red-600 border border-red-600 px-6 py-2 rounded-md font-medium flex items-center"
                    >
                      {removingFromList ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Removendo...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Remover da Minha Lista
                        </>
                      )}
                    </button>
                  ) : (
                    <button 
                      onClick={handleAddToList}
                      disabled={addingToList || userListStatus === 'loading'}
                      className="bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 px-6 py-2 rounded-md font-medium flex items-center"
                    >
                      {addingToList ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adicionando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Adicionar à Minha Lista
                        </>
                      )}
                    </button>
                  )}
                  {!userHasRated && !showRatingForm && (
                    <button 
                      onClick={() => setShowRatingForm(true)}
                      className="bg-white hover:bg-gray-100 text-purple-600 border border-purple-600 px-6 py-2 rounded-md font-medium"
                    >
                      Avaliar este Curso
                    </button>
                  )}
                  {/* Só admins podem criar cupons */}
                  {user?.role === 'admin' && (
                    <button 
                      onClick={() => setShowCouponForm(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
                    >
                      Criar Cupom
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Form Modal */}
      {showCouponForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <CouponForm 
              onCancel={() => setShowCouponForm(false)} 
              onSuccess={() => {
                setShowCouponForm(false);
                alert('Cupom criado com sucesso!');
              }}
            />
          </div>
        </div>
      )}

      {showRatingForm && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sua Avaliação</h2>
          <RatingForm onSubmit={handleAddRating} onCancel={() => setShowRatingForm(false)} />
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Avaliações do Curso</h2>
        
        {ratingStatus === 'loading' ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : ratings.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">Nenhuma avaliação ainda. Seja o primeiro a avaliar este curso!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ratings.map((rating) => (
              <div key={rating.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">{rating.userId.slice(0, 2).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${i < rating.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="mt-1 text-gray-800">{rating.review}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {user && user.id === rating.userId && (
                    <button
                      onClick={() => handleDeleteRating(rating.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita e você será redirecionado para a lista de cursos.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail; 
