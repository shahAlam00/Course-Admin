import React, { useEffect, useState } from "react";
import { Users, IndianRupee, BookOpen, Award, TrendingUp, Clock3, Loader2 } from "lucide-react";
import API from "../utils/axios.js";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/courses/admin/stats").catch(() => ({ data: { data: {} } })),
      API.get("/courses/all").catch(() => ({ data: { data: [] } })),
    ]).then(([statsRes, coursesRes]) => {
      setStats(statsRes.data.data);
      const list = coursesRes.data.data || coursesRes.data.courses || [];
      setCourses(Array.isArray(list) ? list : []);
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: "Total Students", value: stats?.totalStudents ?? "—", icon: Users },
    { title: "Total Enrollments", value: stats?.totalEnrollments ?? "—", icon: IndianRupee },
    { title: "Total Courses", value: stats?.totalCourses ?? "—", icon: BookOpen },
    { title: "Published Courses", value: stats?.publishedCourses ?? "—", icon: Award },
  ];

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your academy performance.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.title}</p>
                      <h2 className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</h2>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Courses */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900">Recent Courses</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs text-slate-500">
                    <th className="px-6 py-4 font-medium">Course</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Enrolled</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.slice(0, 5).map((course) => (
                    <tr key={course._id} className="border-b border-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {course.thumbnail && (
                            <img src={course.thumbnail} alt={course.title} className="h-10 w-16 rounded-lg object-cover" />
                          )}
                          <span className="text-sm font-medium text-slate-800 line-clamp-1 max-w-[200px]">{course.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{course.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        ₹{Number(course.price || 0).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{course.enrolledCount || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${course.status === "Published" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"}`}>
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">No courses yet. Create your first course!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
