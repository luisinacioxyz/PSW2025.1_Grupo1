import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuth } from './store/authSlice';
import { fetchCourses } from './store/courseSlice';
import { fetchUserList } from './store/userListSlice';
import HomePage from './components/HomePage';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import Login from './components/Login';
import Register from './components/Register';
import RatingList from './components/RatingList';
import CouponList from './components/CouponList';
import MyList from './components/MyList';
import MyCourses from './components/MyCourses';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const { status: userListStatus } = useSelector((state) => state.userList);
  
  useEffect(() => {
    // Inicializar autenticação (verificar se há token válido no localStorage)
    dispatch(initializeAuth());
    
    // Carregar cursos na inicialização
    dispatch(fetchCourses());
  }, [dispatch]);

  // Carregar lista do usuário quando ele estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchUserList());
    }
  }, [dispatch, isAuthenticated, user]);

  // Mostrar loading inicial enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            
            {/* Rotas públicas (só para usuários não autenticados) */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas protegidas (só para usuários autenticados) */}
            <Route 
              path="/courses/create" 
              element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-course" 
              element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-list" 
              element={
                <ProtectedRoute>
                  <MyList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ratings" 
              element={
                <ProtectedRoute>
                  <RatingList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-coupons" 
              element={
                <ProtectedRoute>
                  <CouponList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-courses" 
              element={
                <ProtectedRoute>
                  <MyCourses />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
