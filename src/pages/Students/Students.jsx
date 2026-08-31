import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Search, Eye, BookOpen, MapPin, Phone, Loader2, Mail } from "lucide-react";
import API from "../../utils/axios.js";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/auth/students")
      .then(({ data }) => setStudents(data.data || []))
      .catch(() => alert("Failed to load students."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users size={22} className="text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            All registered students and their enrollment details.
          </p>
        </div>

        {/* Stats pill */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <Users size={16} className="text-indigo-600" />
          <span className="text-sm font-bold text-slate-900">{students.length}</span>
          <span className="text-sm text-slate-500">Total Students</span>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
          <Users size={36} className="text-slate-300 mb-3" />
          <p className="font-semibold text-slate-500">No students found</p>
          <p className="text-sm text-slate-400 mt-1">
            {search ? "Try a different search term." : "No students have registered yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Enrolled</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm">
                          {student.avatar || student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{student.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.phone ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Phone size={12} className="text-slate-400" />
                          {student.phone}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student.location ? (
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin size={12} className="text-slate-400" />
                          {student.location}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          <BookOpen size={11} />
                          {student.enrolledCourses} course{student.enrolledCourses !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{student.joinedDate}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/students/${student._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Eye size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((student) => (
              <div key={student._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-black text-sm">
                      {student.avatar || student.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-400">{student.email}</p>
                    </div>
                  </div>
                  <Link
                    to={`/admin/students/${student._id}`}
                    className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                  >
                    <Eye size={15} />
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {student.phone && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Phone size={11} /> {student.phone}
                    </span>
                  )}
                  {student.location && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={11} /> {student.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                    <BookOpen size={10} /> {student.enrolledCourses} courses
                  </span>
                  <span className="text-xs text-slate-400">{student.joinedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Students;
