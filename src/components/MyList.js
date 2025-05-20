import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserList, removeFromList, updateUserList, removeCourseFromList } from '../store/userListSlice';
import { fetchCourses } from '../store/courseSlice';

const MyList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const { userList, status: userListStatus } = useSelector((state) => state.userList);
  const { courses, status: coursesStatus } = useSelector((state) => state.courses);
  const [isLoading, setIsLoading] = useState(true);
  const [savedCourses, setSavedCourses] = useState([]);
  const [removingCourses, setRemovingCourses] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      
      if (coursesStatus === 'idle') {
        await dispatch(fetchCourses()).unwrap();
      }
      
      if (userListStatus === 'idle') {
        await dispatch(fetchUserList(user.id)).unwrap();
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [dispatch, navigate, user, coursesStatus, userListStatus]);

  useEffect(() => {
    if (userList && userList.courseIds && courses.length > 0) {
      const myCourses = userList.courseIds
        .map(id => courses.find(course => course.id === id))
        .filter(Boolean); // Filter out any undefined values
      setSavedCourses(myCourses);
    }
  }, [userList, courses]);

  const handleRemoveFromList = async (courseId) => {
    if (!user || !userList) return;
    
    try {
      setRemovingCourses(prev => ({ ...prev, [courseId]: true }));
      
      // Use the new removeCourseFromList thunk
      await dispatch(removeCourseFromList({
        userList,
        courseId
      })).unwrap();
      
      console.log('Course removed from list successfully');
    } catch (error) {
      console.error('Failed to remove course from list:', error);
    } finally {
      setRemovingCourses(prev => ({ ...prev, [courseId]: false }));
    }
  };

  if (isLoading || userListStatus === 'loading' || coursesStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Minha Lista de Cursos</h1>

      {savedCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Sua lista está vazia</h3>
          <p className="mt-1 text-gray-500">Você ainda não adicionou nenhum curso à sua lista.</p>
          <div className="mt-6">
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
            >
              Explorar Cursos
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={`/courses/${course.id}`} className="block">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                      {course.platform}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm h-12 overflow-hidden">{course.description}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(course.rating)
                              ? 'text-yellow-400'
                              : i < course.rating
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
                    <span className="text-gray-600 text-sm ml-2">
                      ({course.totalRatings} avaliações)
                    </span>
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4 flex justify-between items-center">
                <span className="text-purple-600 font-bold text-xl">R${course.price.toFixed(2)}</span>
                <div className="flex space-x-2">
                  <Link
                    to={`/courses/${course.id}`} 
                    className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Detalhes
                  </Link>
                  <button 
                    onClick={() => handleRemoveFromList(course.id)}
                    disabled={removingCourses[course.id]}
                    className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    {removingCourses[course.id] ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remover
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList; 