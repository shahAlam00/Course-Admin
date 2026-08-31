import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses/Courses";
import CreateCourse from "./pages/Courses/CreateCourse";
import EditCourse from "./pages/Courses/EditCourse";
import CourseContent from "./pages/Courses/CourseContent";
import Students from "./pages/Students/Students";
import StudentDetails from "./pages/Students/StudentDetails";

const Placeholder = ({ title }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        This module is under development.
      </p>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            ROOT REDIRECT
        ========================== */}

        <Route
          path="/"
          element={<Navigate to="/admin" replace />}
        />

        {/* =========================
            ADMIN LAYOUT
        ========================== */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          {/* Dashboard */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* =========================
              LEARNING
          ========================== */}

          <Route
            path="courses"
            element={ <Courses/>
            }
          />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/edit/:id" element={<EditCourse />} />

   <Route
  path="courses/content/:id"
  element={<CourseContent />}
/>
          <Route
            path="lessons"
            element={
              <Placeholder title="Modules & Lessons" />
            }
          />

          <Route
            path="assignments"
            element={
              <Placeholder title="Assignments" />
            }
          />

          <Route
            path="submissions"
            element={
              <Placeholder title="Submissions" />
            }
          />

          <Route
            path="quizzes"
            element={
              <Placeholder title="Quizzes" />
            }
          />

          <Route
            path="question-bank"
            element={
              <Placeholder title="Question Bank" />
            }
          />

          <Route
            path="quiz-attempts"
            element={
              <Placeholder title="Quiz Attempts" />
            }
          />

          {/* =========================
              STUDENTS
          ========================== */}

          <Route
            path="students"
            element={<Students />}
          />

          <Route
            path="students/:id"
            element={<StudentDetails />}
          />

          <Route
            path="progress"
            element={
              <Placeholder title="Student Progress" />
            }
          />

          {/* =========================
              ENGAGEMENT
          ========================== */}

          <Route
            path="doubt-sessions"
            element={
              <Placeholder title="Doubt Sessions" />
            }
          />

          <Route
            path="doubts"
            element={
              <Placeholder title="Student Doubts" />
            }
          />

          <Route
            path="announcements"
            element={
              <Placeholder title="Announcements" />
            }
          />

          {/* =========================
              SALES
          ========================== */}

          <Route
            path="orders"
            element={
              <Placeholder title="Orders" />
            }
          />

          <Route
            path="payments"
            element={
              <Placeholder title="Payments" />
            }
          />

          <Route
            path="coupons"
            element={
              <Placeholder title="Coupons" />
            }
          />

          {/* =========================
              CERTIFICATION
          ========================== */}

          <Route
            path="certificates"
            element={
              <Placeholder title="Certificates" />
            }
          />

          {/* =========================
              CONTENT
          ========================== */}

          <Route
            path="instructors"
            element={
              <Placeholder title="Instructors" />
            }
          />

          <Route
            path="testimonials"
            element={
              <Placeholder title="Testimonials" />
            }
          />

          <Route
            path="faqs"
            element={
              <Placeholder title="FAQs" />
            }
          />

          {/* =========================
              ANALYTICS
          ========================== */}

          <Route
            path="reports"
            element={
              <Placeholder title="Reports" />
            }
          />

          {/* =========================
              SYSTEM
          ========================== */}

          <Route
            path="settings"
            element={
              <Placeholder title="Settings" />
            }
          />

        </Route>

        {/* =========================
            UNKNOWN ROUTES
        ========================== */}

        <Route
          path="*"
          element={
            <Navigate to="/admin" replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;