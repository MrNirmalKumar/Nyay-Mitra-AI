'use client';
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Star, Clock, MapPin, ArrowRight, Scale, X, CheckCircle, Calendar, Phone } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

// Deterministic color assignment based on name
const AVATAR_COLORS = [
  { bg: '#1E3A5F', text: '#F7F6F2' },
  { bg: '#7A1F2B', text: '#F7F6F2' },
  { bg: '#4A5568', text: '#F7F6F2' },
  { bg: '#B8935F', text: '#1A1A1A' },
  { bg: '#2D4A3E', text: '#F7F6F2' },
  { bg: '#553C7B', text: '#F7F6F2' },
];

function getInitials(fullName) {
  const cleaned = fullName.replace(/^Advocate\s+/i, '');
  return cleaned.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('');
}

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const advisors = [
  {
    name: "Advocate Priya Sharma",
    specialty: "Family & Property Law",
    location: "Mumbai High Court",
    rating: 4.9,
    reviews: 124,
    availability: "Available Today",
    experience: "12 yrs",
    languages: ["English", "Hindi", "Marathi"],
  },
  {
    name: "Advocate Rajesh Kumar",
    specialty: "Employment & Labour",
    location: "Delhi District Court",
    rating: 4.8,
    reviews: 89,
    availability: "Available Tomorrow",
    experience: "9 yrs",
    languages: ["English", "Hindi"],
  },
  {
    name: "Advocate Ananya Iyer",
    specialty: "Consumer Rights",
    location: "Bengaluru Consumer Forum",
    rating: 5.0,
    reviews: 210,
    availability: "Available in 2 days",
    experience: "15 yrs",
    languages: ["English", "Kannada", "Tamil"],
  },
  {
    name: "Advocate Arjun Nair",
    specialty: "Cyber Fraud & IP",
    location: "Madras High Court",
    rating: 4.7,
    reviews: 56,
    availability: "Available Today",
    experience: "7 yrs",
    languages: ["English", "Tamil", "Malayalam"],
  },
  {
    name: "Advocate Sunita Rao",
    specialty: "Tenancy & Rental Law",
    location: "Hyderabad Civil Courts",
    rating: 4.8,
    reviews: 143,
    availability: "Available Today",
    experience: "11 yrs",
    languages: ["English", "Telugu", "Hindi"],
  },
  {
    name: "Advocate Vikram Singh",
    specialty: "Criminal Defence",
    location: "Lucknow District Court",
    rating: 4.6,
    reviews: 78,
    availability: "Available Tomorrow",
    experience: "8 yrs",
    languages: ["English", "Hindi", "Urdu"],
  },
];

export default function AdvisorsPage() {
  const { sessionToken, openAuthModal } = useAuth();
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', phone_number: '', time_slot: 'Today Evening', issue_description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);

  // Load bookings from backend on mount or when session changes
  useEffect(() => {
    async function fetchBookings() {
      if (!sessionToken) {
        setBookings([]);
        return;
      }
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/bookings?token=${sessionToken}`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch (e) {
        console.error("Failed to load bookings", e);
      }
    }
    fetchBookings();
  }, [sessionToken]);

  const handleOpenModal = (advocate) => {
    if (!sessionToken) {
      openAuthModal();
      return;
    }
    setSelectedAdvocate(advocate);
    setIsModalOpen(true);
    setSubmitSuccess(false);
    setFormError('');
    setFormData({ full_name: '', phone_number: '', time_slot: 'Today Evening', issue_description: '' });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedAdvocate(null);
      setSubmitSuccess(false);
    }, 300);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.full_name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phone_number.replace(/\D/g, '');
    if (!validatePhone(cleanPhone)) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone_number: cleanPhone,
          advocate_name: selectedAdvocate.name,
          session_token: sessionToken
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to submit booking');
      }

      // Success
      setSubmitSuccess(true);
      
      // Update local storage bookings
      const newBooking = {
        id: data.booking.id,
        advocate: data.booking.advocate_name,
        time_slot: data.booking.time_slot,
        status: 'Pending',
        created_at: new Date().toISOString()
      };
      const updatedBookings = [newBooking, ...bookings];
      setBookings(updatedBookings);
      localStorage.setItem('nyay_bookings', JSON.stringify(updatedBookings));

    } catch (error) {
      console.error(error);
      setFormError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#1A1A1A]">
      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">

        {/* Page Header */}
        <div className="mb-12 pb-8 border-b border-[#E5E3DD]">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-[#B8935F]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#B8935F]">
              Bar Council Verified Professionals
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1E3A5F] mb-4">
            Consult a Local Advocate
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
            Connect with experienced, Bar Council verified advocates who specialize in your legal issue. 
            All advocates listed have been screened for professional standing and client satisfaction.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {["Bar Council Verified", "Free 15-min Initial Consultation", "Data Privacy Assured"].map(badge => (
              <span key={badge} className="px-3 py-1 text-[11px] font-semibold border border-[#1E3A5F]/30 text-[#1E3A5F] rounded-full bg-[#1E3A5F]/5">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* My Bookings Section */}
        {bookings.length > 0 && (
          <div className="mb-10 p-6 rounded-2xl bg-white border border-[#E5E3DD] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-[#B8935F]" />
              <h2 className="text-lg font-bold text-[#1E3A5F]">Your Consultation Requests</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div>
                    <p className="font-bold text-[#1E3A5F] text-sm">{booking.advocate}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      Requested: {booking.time_slot}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 rounded-md">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advocate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {advisors.map((advocate) => {
            const initials = getInitials(advocate.name);
            const color = getAvatarColor(advocate.name);
            return (
              <div
                key={advocate.name}
                className="p-6 rounded-2xl bg-white border border-[#E5E3DD] hover:border-[#B8935F]/40 hover:shadow-lg transition-all duration-200 group flex flex-col sm:flex-row gap-5"
              >
                {/* Initials Avatar */}
                <div className="shrink-0 relative self-start">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm"
                    style={{ backgroundColor: color.bg, color: color.text }}
                  >
                    {initials}
                  </div>
                  {/* Verified badge */}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shadow-sm border-2 border-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-[#1E3A5F] group-hover:text-[#7A1F2B] transition-colors leading-tight">
                      {advocate.name}
                    </h3>
                    <p className="text-sm text-[#B8935F] font-semibold mt-0.5">
                      {advocate.specialty}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {advocate.location}
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Star className="w-3.5 h-3.5 text-[#B8935F] fill-[#B8935F]" />
                      <span className="font-bold text-[#1A1A1A]">{advocate.rating}</span>
                      <span className="text-slate-500">({advocate.reviews} reviews)</span>
                    </div>
                    <span className="text-slate-500">{advocate.experience} exp.</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {advocate.languages.map(lang => (
                      <span key={lang} className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded border border-slate-200">
                        {lang}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#E5E3DD]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <Clock className="w-3.5 h-3.5" />
                      {advocate.availability}
                    </div>
                    <button 
                      onClick={() => handleOpenModal(advocate)}
                      className="px-4 py-2 rounded-lg bg-[#1E3A5F] text-white hover:bg-[#152d4a] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      Book Consultation <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Booking Modal */}
      {isModalOpen && selectedAdvocate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E3A5F]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-[#F8F6F0] p-5 border-b border-[#E5E3DD] flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                  style={{ 
                    backgroundColor: getAvatarColor(selectedAdvocate.name).bg, 
                    color: getAvatarColor(selectedAdvocate.name).text 
                  }}
                >
                  {getInitials(selectedAdvocate.name)}
                </div>
                <div>
                  <h3 className="font-bold text-[#1E3A5F]">{selectedAdvocate.name}</h3>
                  <p className="text-xs text-[#B8935F] font-semibold">{selectedAdvocate.specialty}</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="p-2 -mr-2 -mt-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {submitSuccess ? (
                <div className="py-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1E3A5F]">Request Sent!</h3>
                  <p className="text-slate-600 leading-relaxed max-w-xs">
                    <strong className="text-[#1E3A5F]">{selectedAdvocate.name}</strong> will call you at <strong className="text-[#1E3A5F]">{formData.phone_number}</strong> for your <strong className="text-[#1E3A5F]">{formData.time_slot}</strong> consultation slot.
                  </p>
                  <button 
                    onClick={handleCloseModal}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-[#F7F6F2] text-[#1E3A5F] border border-[#E5E3DD] hover:bg-[#E5E3DD] font-bold text-sm transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                      {formError}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-bold text-[#1E3A5F] mb-1.5 uppercase tracking-wide">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={formData.full_name}
                      onChange={e => setFormData({...formData, full_name: e.target.value})}
                      placeholder="e.g., Rahul Verma"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none text-slate-800 text-sm bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E3A5F] mb-1.5 uppercase tracking-wide">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-4 h-4 text-slate-400" />
                      </div>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone_number}
                        onChange={e => setFormData({...formData, phone_number: e.target.value})}
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none text-slate-800 text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E3A5F] mb-1.5 uppercase tracking-wide">Preferred Time Slot *</label>
                    <select 
                      value={formData.time_slot}
                      onChange={e => setFormData({...formData, time_slot: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none text-slate-800 text-sm bg-white appearance-none"
                    >
                      <option>Today Evening</option>
                      <option>Tomorrow Morning</option>
                      <option>Tomorrow Afternoon</option>
                      <option>This Week</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E3A5F] mb-1.5 uppercase tracking-wide">Brief Description (Optional)</label>
                    <textarea 
                      value={formData.issue_description}
                      onChange={e => setFormData({...formData, issue_description: e.target.value})}
                      placeholder="e.g., Landlord not returning my deposit"
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#B8935F] focus:ring-1 focus:ring-[#B8935F] outline-none text-slate-800 text-sm bg-white resize-none"
                    />
                  </div>

                  <p className="text-[10px] text-slate-500 text-center italic mt-2">
                    This is a demo booking flow. In production, this would notify a verified advocate via SMS/email.
                  </p>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 py-3 rounded-xl bg-[#1E3A5F] hover:bg-[#152d4a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}