import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CourseForm from './CourseForm';

const CreateCourse = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  // Redirect to login if user is not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-purple-600 hover:text-purple-800 flex items-center"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Course
        </h1>
        <CourseForm 
          onCancel={() => navigate(-1)} 
        />
      </div>
    </div>
  );
};

export default CreateCourse; 