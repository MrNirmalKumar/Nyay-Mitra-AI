"use client";

import React, { useState, useEffect } from "react";
import { Activity, Bell, MapPin, User, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveActivity {
  id: string;
  message: string;
  timestamp: string;
  type: 'advocate' | 'ai';
  topic: string;
}

export function LiveDashboard() {
  const [activities, setActivities] = useState<LiveActivity[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchActivities();

    // Poll every 10 seconds
    const interval = setInterval(() => {
      fetchActivities();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/advisors/live");
      if (res.ok) {
        const data = await res.json();
        if (data.activities && data.activities.length > 0) {
          setActivities(prev => {
            const newActivities = [...data.activities, ...prev];
            // Keep only the latest 10
            return newActivities.slice(0, 10);
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch live activities", err);
    }
  };

  const formatTimeAgo = (isoString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    return `${Math.floor(seconds / 60)}m ago`;
  };

  return (
    <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 backdrop-blur-md overflow-hidden flex flex-col h-full max-h-[500px]">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Platform Activity</h3>
        </div>
        <Activity className="w-4 h-4 text-slate-500" />
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/50 hover:bg-slate-800/40 transition-colors"
            >
              <div className="mt-1 shrink-0">
                {activity.type === 'advocate' ? (
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shadow-[0_0_10px_rgba(250,204,21,0.1)]">
                    <Cpu className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {/* Highlight the name and topic */}
                  {activity.message.split(activity.topic).map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-white font-semibold">{activity.topic}</span>}
                    </React.Fragment>
                  ))}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                    {activity.type === 'advocate' ? 'Human Verified' : 'AI Analysis'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activities.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center text-slate-500 gap-2">
            <Activity className="w-6 h-6 animate-pulse" />
            <span className="text-xs">Listening for live updates...</span>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}
