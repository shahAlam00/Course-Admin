import React from "react";
import {
  Bell,
  Search,
  User,
  LogOut,
} from "lucide-react";

const Topbar = ({ collapsed }) => {
  return (
    <header
      className={`
        fixed right-0 top-0 z-40
        h-[72px]
        border-b border-slate-200
        bg-white/95 backdrop-blur
        transition-all duration-300
        ${collapsed ? "left-[80px]" : "left-[260px]"}
      `}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Search */}
        <div className="relative w-[320px]">
          <Search
            size={18}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search students, courses..."
            className="
              h-10 w-full rounded-xl
              border border-slate-200
              bg-slate-50
              pl-10 pr-4
              text-sm
              outline-none
              transition
              focus:border-slate-400
              focus:bg-white
            "
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button
            className="
              relative flex h-10 w-10
              items-center justify-center
              rounded-xl
              text-slate-500
              hover:bg-slate-100
            "
          >
            <Bell size={19} />

            <span
              className="
                absolute right-2 top-2
                h-2 w-2 rounded-full
                bg-red-500
              "
            />
          </button>

          <div className="h-7 w-px bg-slate-200" />

          <div className="flex items-center gap-3">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-full bg-slate-900
                text-white
              "
            >
              <User size={17} />
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-900">
                Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <button className="text-slate-400 hover:text-red-500">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;