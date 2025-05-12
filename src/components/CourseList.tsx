import React, { useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchCourses, setSearchTerm, setSelectedPlatform } from '../store/slices/courseSlice';

const CourseList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { courses, status, error, searchTerm, selectedPlatform } = useAppSelector(
    (state) => state.courses
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses());
    }
  }, [dispatch, status]);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedPlatform || course.platform === selectedPlatform)
  );

  if (status === 'loading') {
    return <div className="text-center p-4">Loading courses...</div>;
  }

  if (status === 'failed') {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search courses..."
          className="px-4 py-2 border rounded-lg flex-1"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />
        <select
          className="px-4 py-2 border rounded-lg"
          value={selectedPlatform}
          onChange={(e) => dispatch(setSelectedPlatform(e.target.value))}
        >
          <option value="">All Platforms</option>
          <option value="Udemy">Udemy</option>
          <option value="Coursera">Coursera</option>
          <option value="Alura">Alura</option>
          <option value="Domestika">Domestika</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-purple-600 font-bold">${course.price}</span>
                <span className="text-gray-500">{course.platform}</span>
              </div>
              <div className="mt-2 flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{course.rating}</span>
                <span className="text-gray-500 text-sm ml-2">
                  ({course.totalRatings} ratings)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList; 