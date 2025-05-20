import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, setSearchTerm, setSelectedPlatform } from '../store/courseSlice';
import { Link } from 'react-router-dom';

const CourseList = () => {
  const dispatch = useDispatch();
  const { courses, status, error, searchTerm, selectedPlatform } = useSelector(
    (state) => state.courses
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'idle') {
      setIsLoading(true);
      dispatch(fetchCourses())
        .unwrap()
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, status]);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedPlatform || course.platform === selectedPlatform)
  );

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handlePlatformChange = (e) => {
    dispatch(setSelectedPlatform(e.target.value));
  };

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
        Erro: {error || 'Falha ao carregar cursos'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Descubra os Melhores Cursos Online
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Cursos
            </label>
            <input
              id="search"
              type="text"
              placeholder="Buscar por título..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="md:w-1/3">
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Plataforma
            </label>
            <select
              id="platform"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={selectedPlatform}
              onChange={handlePlatformChange}
            >
              <option value="">Todas as Plataformas</option>
              <option value="Udemy">Udemy</option>
              <option value="Coursera">Coursera</option>
              <option value="Alura">Alura</option>
              <option value="Domestika">Domestika</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-500">Nenhum curso encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Tente ajustar sua busca ou filtro para encontrar o que você está procurando.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
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
                  <a 
                    href={course.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visitar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList; 