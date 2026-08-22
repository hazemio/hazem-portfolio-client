import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { authApi } from '../../api';
import { useAuthStore, useThemeStore } from '../../store';

const ADMIN_BASE = '/tech/mode1/dash/hg/admin';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  // theme + redirect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');

    if (isAuthenticated) {
      navigate(ADMIN_BASE);
    }
  }, [isAuthenticated, theme, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.login(form);

      // session-based login (no JWT needed فعليًا)
      login(res.data.user.id, res.data.user);

      toast.success('Welcome back! 👋');
      navigate(ADMIN_BASE);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || 'Invalid credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] relative overflow-hidden">

      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-4"
      >
        <div className="glass-light rounded-3xl p-8 sm:p-10 border border-[var(--border)]">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl">
              HG
            </div>

            <h1 className="text-2xl font-bold mt-3">
              Admin Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Sign in to manage your portfolio
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />

                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, password: e.target.value }))
                  }
                  className="input-field pl-10 pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-gray-400"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}