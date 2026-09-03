import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMoon, FiClock } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { useApi } from '../../hooks';
import { profileApi } from '../../api';
import { Profile } from '../../types';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function RamadanBanner() {
  const { data: profile } = useApi<Profile>(() => profileApi.get());
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!profile) {
      setIsActive(false);
      return;
    }

    const {
      ramadanThemeEnabled,
      ramadanThemeForceEnabled,
      ramadanThemeStartDate,
      ramadanThemeEndDate,
    } = profile;

    const now = new Date();
    const isForce = !!ramadanThemeForceEnabled;

    let isDateActive = false;
    if (ramadanThemeEnabled && ramadanThemeStartDate && ramadanThemeEndDate) {
      const start = new Date(ramadanThemeStartDate);
      const end = new Date(ramadanThemeEndDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        isDateActive = now >= start && now <= end;
      }
    }

    const activeState = isForce || isDateActive;
    setIsActive(activeState);

    // Dynamic body ambient class toggle when theme is active
    if (activeState) {
      document.body.classList.add('ramadan-theme-active');
    } else {
      document.body.classList.remove('ramadan-theme-active');
    }
  }, [profile]);

  // Countdown timer logic
  useEffect(() => {
    if (!isActive || !profile?.ramadanTimerEnabled) {
      setTimeLeft(null);
      return;
    }

    // Determine target date: fallback to start date or configured target date (e.g. Next Ramadan)
    const targetDateStr = profile.ramadanThemeStartDate || '2026-02-17T00:00:00';
    const targetDate = new Date(targetDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        // If target date has passed, hide timer or show zeros
        setTimeLeft(null);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isActive, profile?.ramadanTimerEnabled, profile?.ramadanThemeStartDate]);

  if (!isActive) return null;

  const bannerText = profile?.ramadanBannerText || 'Ramadan Mubarak! 🌙 | رمضان مبارك';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full bg-gradient-to-r from-amber-950/90 via-slate-900/95 to-amber-950/90 border-b border-amber-500/30 text-amber-100 text-xs py-2 px-4 shadow-lg backdrop-blur-md relative z-[60]"
      >
        <div className="container-custom flex flex-wrap items-center justify-between gap-3">
          {/* Banner Message & Crescent Accent */}
          <div className="flex items-center gap-2 font-medium">
            <span className="p-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 animate-pulse">
              <FiMoon size={13} />
            </span>
            <span className="tracking-wide text-amber-200">{bannerText}</span>
            <FaStar className="text-amber-400/60 text-[10px] hidden sm:inline-block" />
          </div>

          {/* Countdown Timer Widget (If Enabled) */}
          {profile?.ramadanTimerEnabled && timeLeft && (
            <div className="flex items-center gap-2 font-mono text-[11px] bg-black/40 px-3 py-1 rounded-full border border-amber-500/30 text-amber-300">
              <FiClock size={12} className="text-amber-400" />
              <span className="text-amber-200/80 hidden xs:inline">Countdown:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold">{timeLeft.days}d</span>:
                <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}h</span>:
                <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}m</span>:
                <span className="font-bold text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
