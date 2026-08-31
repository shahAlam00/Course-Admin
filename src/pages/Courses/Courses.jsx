import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Search, MoreVertical, Edit3, Trash2, Eye, EyeOff,
  BookOpen, Users, Clock3, IndianRupee, MoreHorizontal, X, Play,
} from "lucide-react";
import API from "../../utils/axios.js";

const getYoutubeId = (url = "") => {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? match[1] : "";
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openMenu, setOpenMenu] = useState(null);
  const [videoModal, setVideoModal] = useState(null); // { youtubeUrl, title }
  const [loading, setLoading] = useState(true);

  const fetchCourses = () => {
    setLoading(true);
    API.get("/courses/all")
      .then(({ data }) => {
        const list = data.courses || data.data || data;
        setCourses(Array.isArray(list) ? list : []);
      })
      .catch(() => alert("Failed to load courses."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(search.toLowerCase()) ||
      course.category?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Published" ? "Draft" : "Published";
    try {
      await API.put(`/courses/update/${id}`, { status: newStatus });
      setCourses((prev) =>
        prev.map((c) => (c._id === id || c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch {
      alert("Failed to update status.");
    }
    setOpenMenu(null);
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/delete/${id}`);
      setCourses((prev) => prev.filter((c) => c._id !== id && c.id !== id));
    } catch {
      alert("Failed to delete course.");
    }
    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={24} className="text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">Create and manage your academy courses.</p>
        </div>
        <Link to="/admin/courses/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
          <Plus size={18} /> Create Course
        </Link>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Courses" value={courses.length} icon={BookOpen} />
        <StatCard title="Published" value={courses.filter((c) => c.status === "Published").length} icon={Eye} />
        <StatCard title="Total Students" value={courses.reduce((a, c) => a + (c.students || 0), 0)} icon={Users} />
        <StatCard title="Course Revenue" icon={IndianRupee}
          value={"₹" + courses.reduce((a, c) => a + (Number(c.price) || 0), 0).toLocaleString("en-IN")} />
      </div>

      {/* FILTER BAR */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search courses..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white" />
          </div>
          <div className="flex items-center gap-2">
            {["All", "Published", "Draft"].map((status) => (
              <button key={status} onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${statusFilter === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COURSE GRID */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course._id || course.id}
              course={course}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              toggleStatus={toggleStatus}
              deleteCourse={deleteCourse}
              onVideoClick={() => setVideoModal({ youtubeUrl: course.youtubeUrl, title: course.title })}
            />
          ))}
        </div>
      )}

      {/* VIDEO MODAL */}
      {videoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setVideoModal(null)}>
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setVideoModal(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300">
              <X size={24} />
            </button>
            {videoModal.youtubeUrl ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeId(videoModal.youtubeUrl)}?autoplay=1`}
                className="h-[400px] w-full rounded-2xl"
                allowFullScreen allow="autoplay"
                title={videoModal.title} />
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-2xl bg-slate-900 text-slate-400">
                No video available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const CourseCard = ({ course, openMenu, setOpenMenu, toggleStatus, deleteCourse, onVideoClick }) => {
  const courseId = course._id || course.id;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden cursor-pointer group" onClick={onVideoClick}>
        <img src={course.thumbnail} alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-slate-900">
            <Play size={22} fill="currentColor" />
          </div>
        </div>
        {/* Status badge */}
        <div className="absolute left-3 top-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${course.status === "Published" ? "bg-emerald-500 text-white" : "bg-white text-slate-700"}`}>
            {course.status}
          </span>
        </div>
        {/* Menu */}
        <div className="absolute right-3 top-3" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setOpenMenu(openMenu === courseId ? null : courseId)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/95 text-slate-700 shadow hover:bg-white">
            <MoreVertical size={18} />
          </button>
          {openMenu === courseId && (
            <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
              <Link to={`/admin/courses/edit/${courseId}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                <Edit3 size={16} /> Edit Course
              </Link>
              <Link to={`/admin/courses/content/${courseId}`}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                <BookOpen size={16} /> Manage Content
              </Link>
              <button onClick={() => toggleStatus(courseId, course.status)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50">
                {course.status === "Published" ? <><EyeOff size={16} /> Unpublish</> : <><Eye size={16} /> Publish</>}
              </button>
              <div className="my-1 border-t border-slate-100" />
              <button onClick={() => deleteCourse(courseId)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50">
                <Trash2 size={16} /> Delete Course
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {course.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Users size={13} /> {course.students || 0}
          </div>
        </div>
        <h3 className="line-clamp-1 text-lg font-bold text-slate-900">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{course.description || course.shortDescription}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5"><BookOpen size={14} /> {course.lessons || 0} Lessons</div>
          <div className="flex items-center gap-1.5"><Clock3 size={14} /> {course.duration || "—"}</div>
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">Course Price</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900">
                ₹{Number(course.price || 0).toLocaleString("en-IN")}
              </span>
              {course.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{Number(course.originalPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
          <Link to={`/admin/courses/content/${courseId}`}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800">
            Manage <MoreHorizontal size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
      <BookOpen size={25} />
    </div>
    <h3 className="mt-4 font-semibold text-slate-900">No courses found</h3>
    <p className="mt-1 text-sm text-slate-500">Try changing your search or filter.</p>
  </div>
);

export default Courses;
