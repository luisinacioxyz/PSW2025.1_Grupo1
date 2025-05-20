import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CourseList from './components/CourseList';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-purple-600">
                CourseRank
              </Link>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
                >
                  Home
                </Link>
                <Link
                  to="/courses"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
                >
                  Courses
                </Link>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<CourseList />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App; 