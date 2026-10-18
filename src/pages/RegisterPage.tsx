import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Sparkles, AlertCircle, BookOpen, CheckCircle2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { registerUser } from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(email, password);
      queryClient.clear(); // Clear all old cached documents
      setAuth(res.data.token, res.data.user);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'การสมัครสมาชิกล้มเหลว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200">
        <div className="card-body p-8">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-2xl mb-3">
              <BookOpen className="w-8 h-8 text-secondary" />
              <Sparkles className="w-4 h-4 text-primary -ml-1 -mt-3" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">สร้างบัญชีใหม่</h1>
            <p className="text-sm text-base-content/70 mt-1">
              เริ่มต้นติวและสรุปบทเรียนด้วย AI Study Buddy
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error shadow-sm mb-4 py-2 px-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">อีเมล (Email)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="input input-bordered w-full pl-10"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10"
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">ยืนยันรหัสผ่านอีกครั้ง</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2 gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  กำลังสร้างบัญชี...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  สมัครสมาชิก
                </>
              )}
            </button>
          </form>

          {/* Login Prompt */}
          <div className="text-center mt-6 pt-4 border-t border-base-200">
            <p className="text-sm text-base-content/70">
              มีบัญชีอยู่แล้ว?{' '}
              <Link to="/login" className="link link-primary font-semibold">
                เข้าสู่ระบบที่นี่
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
