import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, fetchUser } from "./store/userSlice";
import { fetchCourses } from "./store/courseSlice";
import { fetchUserList } from "./store/userListSlice";
import HomePage from "./components/HomePage";
import CourseList from "./components/CourseList";
import CourseDetail from "./components/CourseDetail";
import CreateCourse from "./components/CreateCourse";
import Login from "./components/Login";
import RatingList from "./components/RatingList";
import CouponList from "./components/CouponList";
import MyList from "./components/MyList";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const { courses, status: coursesStatus } = useSelector(
    (state) => state.courses
  );
  const { userList, status: userListStatus } = useSelector(
    (state) => state.userList
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Load user from localStorage if available
    const userId = localStorage.getItem("userId");
    if (userId && !user) {
      dispatch(fetchUser(userId)).then((resultAction) => {
        if (fetchUser.fulfilled.match(resultAction)) {
          // Fetch user list after user is loaded
          dispatch(fetchUserList(userId));
        }
      });
    }

    // Fetch courses on app load
    dispatch(fetchCourses()).then(() => {
      console.log(
        "Courses loaded:",
        courses.map((c) => `${c.id}: ${c.title}`)
      );
    });

    // Fetch user's list if logged in but not yet loaded
    if (user && userListStatus === "idle") {
      dispatch(fetchUserList(user.id));
    }
  }, [dispatch, user, userListStatus]);

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link
        to="/"
        className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
        onClick={() => setIsMenuOpen(false)}
      >
        Início
      </Link>
      <Link
        to="/courses"
        className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
        onClick={() => setIsMenuOpen(false)}
      >
        Cursos
      </Link>
      {user ? (
        <>
          <Link
            to="/my-list"
            className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Minha Lista
          </Link>
          <Link
            to="/ratings"
            className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Minhas Avaliações
          </Link>
          <Link
            to="/my-coupons"
            className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Meus Cupons
          </Link>
          <Link
            to="/courses/create"
            className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md"
            onClick={() => setIsMenuOpen(false)}
          >
            Adicionar Curso
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md w-full text-left"
          >
            Sair
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-block"
          onClick={() => setIsMenuOpen(false)}
        >
          Entrar
        </Link>
      )}
    </>
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-white shadow-lg relative z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-purple-600">
                CourseRank
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {/* Desktop menu */}
              <div className="hidden md:flex space-x-4 items-center">
                <NavLinks />
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLinks />
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/create" element={<CreateCourse />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/ratings" element={<RatingList />} />
            <Route path="/my-coupons" element={<CouponList />} />
            <Route path="/my-list" element={<MyList />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
