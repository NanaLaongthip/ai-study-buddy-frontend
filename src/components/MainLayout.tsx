import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Brain, UploadCloud, Moon, Sun, LogOut, LogIn, UserPlus, User, Info } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useStudyStore } from '../stores/useStudyStore';
import { useAuthStore } from '../stores/useAuthStore';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isDarkMode = useStudyStore((state) => state.isDarkMode);
  const toggleDarkMode = useStudyStore((state) => state.toggleDarkMode);

  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    queryClient.clear(); // Wipe all cached data for previous account
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content font-sans">
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-200 shadow-sm transition-all">
        <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="navbar-start">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-inner">
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  AI Study Buddy
                </span>
                <span className="text-[10px] text-base-content/60 font-medium tracking-wide">
                  ผู้ช่วยติวหนังสืออัจฉริยะ
                </span>
              </div>
            </Link>
          </div>

          <div className="navbar-center hidden md:flex">
            {isAuthenticated && (
              <ul className="menu menu-horizontal px-1 gap-1 font-medium text-sm">
                <li>
                  <Link
                    to="/"
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                      location.pathname === '/' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-base-200'
                    }`}
                  >
                    <UploadCloud className="w-4 h-4" />
                    หน้าหลัก & อัปโหลด
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div className="navbar-end gap-2">
            <Link
              to="/about"
              aria-label="เกี่ยวกับ AI Study Buddy"
              className={`btn btn-ghost btn-sm rounded-lg gap-1.5 ${
                location.pathname === '/about' ? 'text-primary' : ''
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">เกี่ยวกับ</span>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="btn btn-ghost btn-circle btn-sm text-base-content/80 hover:text-primary"
              aria-label="Toggle theme"
              title={isDarkMode ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-warning" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* User email badge */}
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-sm gap-2 normal-case font-normal rounded-lg border border-base-200">
                    <User className="w-4 h-4 text-primary" />
                    <span className="max-w-[120px] sm:max-w-[160px] truncate font-medium text-xs">
                      {user?.email}
                    </span>
                  </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-200 text-sm mt-1">
                    <li className="menu-title px-4 py-1 text-xs text-base-content/60">
                      เข้าใช้งานในชื่อ:
                      <span className="font-semibold text-base-content block truncate">{user?.email}</span>
                    </li>
                    <div className="divider my-1"></div>
                    <li>
                      <button onClick={handleLogout} className="text-error flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        ออกจากระบบ
                      </button>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm text-error hidden sm:inline-flex gap-1"
                  title="ออกจากระบบ"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs">ออก</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-ghost btn-sm rounded-lg gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm rounded-lg shadow-sm gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 flex flex-col">
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-6 bg-base-200 text-base-content border-t border-base-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          <aside className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <p className="text-xs text-base-content/70">
              © {new Date().getFullYear()} AI Study Buddy — เปลี่ยนสไลด์บทเรียนเป็นสรุป จุดเน้นสอบ แฟลชการ์ด และแบบทดสอบอัจฉริยะ (ภาษาไทย)
            </p>
          </aside>
          <nav className="flex items-center gap-4 text-xs text-base-content/70">
            <span className="badge badge-ghost badge-sm">React 19 + Vite</span>
            <span className="badge badge-ghost badge-sm">DaisyUI + Tailwind</span>
            <span className="badge badge-ghost badge-sm">PostgreSQL + Prisma</span>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
