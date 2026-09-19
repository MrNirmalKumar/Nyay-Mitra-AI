'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { Scale, Check, X, Shield, ArrowRight } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  
  // 1: Phone Entry, 2: OTP, 3: Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  
  const [timeLeft, setTimeLeft] = useState(300);
  const [shake, setShake] = useState(false);
  const [otpSuccessFlash, setOtpSuccessFlash] = useState(false);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep(1);
      setPhone('');
      setOtp(['', '', '', '', '', '']);
      setError('');
      setDemoOtp('');
      setTimeLeft(300);
      setShake(false);
      setOtpSuccessFlash(false);
    }
  }, [isAuthModalOpen]);

  // Countdown timer for OTP
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phone.length !== 10) return;
    
    setIsLoading(true);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Failed to send OTP');
      
      if (data.demo_otp) {
        setDemoOtp(data.demo_otp);
      }
      
      setStep(2);
      // Auto-focus first OTP input slightly after transition
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (currentOtp: string) => {
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phone, otp: currentOtp })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Invalid OTP');
      
      // Success flash animation
      setOtpSuccessFlash(true);
      login(data.session_token, data.phone_number);
      
      setTimeout(() => {
        setStep(3);
      }, 500);
      
      // Auto close
      setTimeout(() => {
        closeAuthModal();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message);
      setShake(true);
      setTimeout(() => setShake(false), 400); // reset shake
      setOtp(['', '', '', '', '', '']); // clear
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^[0-9]*$/.test(val)) return; // Only numbers
    
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1); // Only take last char if they pasted
    setOtp(newOtp);
    
    // Auto advance
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    
    // Check if complete
    if (val && index === 5 && newOtp.every(d => d !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Animation Variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };
  
  const direction = step === 2 ? 1 : step === 3 ? 1 : -1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-md"
        onClick={closeAuthModal}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative min-h-[400px] flex flex-col"
        >
          {/* Close button */}
          <button 
            onClick={closeAuthModal}
            className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              {/* SCREEN 1: PHONE */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 p-8 flex flex-col justify-center"
                >
                  <div className="text-center mb-8">
                    <motion.div 
                      animate={{ scale: [1, 1.03, 1] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 mx-auto bg-[#F8F6F0] rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-[#E5E3DD]"
                    >
                      <Scale className="w-8 h-8 text-[#B8935F]" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-[#1E3A5F] font-serif mb-2">Verify Your Number</h2>
                    <p className="text-sm text-slate-500">We'll send a one-time code to confirm it's really you.</p>
                  </div>

                  <form onSubmit={handleSendOtp} className="space-y-6">
                    {error && <p className="text-xs text-rose-500 text-center font-medium bg-rose-50 p-2 rounded-lg">{error}</p>}
                    
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-xl mr-2">🇮🇳</span>
                        <span className="text-slate-500 font-semibold border-r border-slate-200 pr-3">+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-[90px] pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-[#1E3A5F] focus:ring-4 focus:ring-[#1E3A5F]/10 outline-none text-lg font-bold text-slate-800 transition-all shadow-sm group-hover:border-slate-300"
                        placeholder="00000 00000"
                        autoFocus
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={phone.length !== 10 || isLoading}
                      className="w-full py-4 rounded-xl font-bold text-white text-base transition-all flex items-center justify-center gap-2
                        disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none
                        bg-[#1E3A5F] hover:bg-[#152d4a] shadow-lg shadow-navy-900/20 active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Send OTP <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* SCREEN 2: OTP */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute inset-0 p-8 flex flex-col justify-center"
                >
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1E3A5F]">
                      <Shield className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1E3A5F] font-serif mb-2">Enter Verification Code</h2>
                    <p className="text-sm text-slate-500">Sent to <span className="font-bold text-[#1E3A5F]">+91 {phone}</span></p>
                  </div>

                  <div className="space-y-6">
                    {error && <p className="text-xs text-rose-500 text-center font-medium">{error}</p>}
                    
                    <motion.div 
                      className="flex justify-between gap-2"
                      animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {otp.map((digit, i) => (
                        <motion.input
                          key={i}
                          ref={el => { otpRefs.current[i] = el; }}
                          type="tel"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          whileFocus={{ scale: 1.05 }}
                          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all
                            ${otpSuccessFlash 
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                              : shake 
                                ? 'border-rose-500 bg-rose-50 text-rose-700'
                                : digit 
                                  ? 'border-[#1E3A5F] bg-[#F8F6F0] text-[#1E3A5F]' 
                                  : 'border-slate-200 bg-white focus:border-[#B8935F]'}`}
                        />
                      ))}
                    </motion.div>

                    {/* Countdown */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">
                          {timeLeft > 0 ? `Expires in ${minutes}:${seconds.toString().padStart(2, '0')}` : 'OTP Expired'}
                        </span>
                        <button 
                          disabled={timeLeft > 0}
                          onClick={handleSendOtp} // resend
                          className={`transition-colors ${timeLeft > 0 ? 'text-slate-300' : 'text-[#B8935F] hover:text-[#917144]'}`}
                        >
                          Resend OTP
                        </button>
                      </div>
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-[#B8935F]"
                          initial={{ width: "100%" }}
                          animate={{ width: `${(timeLeft / 300) * 100}%` }}
                          transition={{ ease: "linear" }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Demo Mode Banner */}
                  <AnimatePresence>
                    {demoOtp && (
                      <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="absolute top-4 left-4 right-12 bg-emerald-50 border border-emerald-200 rounded-xl p-3 shadow-md z-20 cursor-pointer"
                        onClick={() => setDemoOtp('')}
                      >
                        <p className="text-xs text-emerald-800 font-medium">
                          <span className="font-bold">Demo Mode:</span> Your OTP is <span className="font-bold text-lg">{demoOtp}</span>
                        </p>
                        <p className="text-[9px] text-emerald-600 mt-0.5">(In production, sent via SMS)</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* SCREEN 3: SUCCESS */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#F8F6F0]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, delay: 0.1 }}
                    className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-[#1E3A5F] font-serif"
                  >
                    You're Verified!
                  </motion.h2>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
