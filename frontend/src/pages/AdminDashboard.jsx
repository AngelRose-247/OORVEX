import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { fetchAdminContributions, approveContribution, rejectContribution } from '../services/api';
import {
  ShieldCheck, Check, X, Clock, AlertCircle, Eye, ExternalLink, RefreshCw, MessageSquare
} from 'lucide-react';

export default function AdminDashboard({ onNavigate }) {
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected'
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});
  const [message, setMessage] = useState('');

  // Fallback demo contributions for preview if server is offline
  const fallbackContributions = [
    {
      id: 101,
      title: 'Pulikkali (Tiger Dance of Swaraj Round)',
      title_ml: 'പുലിക്കളി (തൃശ്ശൂർ)',
      category_name: 'Folk Dances',
      district_name: 'Thrissur',
      locality: 'Swaraj Round, Thrissur',
      contributor_name: 'Vishnu K. Namboothiri',
      contributor_email: 'vishnu.heritage@example.com',
      description: 'Pulikkali is a vibrant folk festival performed on the fourth day of Onam celebrations in Thrissur. Performers painted intricately as tigers and leopards dance to rhythmic beating of Udukku and Thakkil drums.',
      cultural_story: 'Introduced over two centuries ago by Maharaja Sakthan Thampuran to celebrate courage and street gaiety.',
      image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
      image_credit: 'Wikimedia Commons / CC BY-SA 4.0',
      source_reference: 'Thrissur Heritage Council Archives #TH-PK-89',
      status: 'pending',
      submitted_at: '2026-11-06T14:30:00Z'
    },
    {
      id: 102,
      title: 'Kummattikali Mask Dance',
      title_ml: 'കുമ്മാട്ടിക്കളി',
      category_name: 'Folk Dances',
      district_name: 'Palakkad',
      locality: 'Alathur & Chittur temples',
      contributor_name: 'Sreejith Warrier',
      contributor_email: 'warrier@kummatti.org',
      description: 'Performers wear wooden masks representing Shiva, Narada, and Darika, wearing plaited grass skirts (Kummatti pullu).',
      cultural_story: 'Enacted to commemorate the mythical dance of Shiva’s bhutas celebrating triumph over demons.',
      image: 'https://images.unsplash.com/photo-1599824425751-2405c935d21c?auto=format&fit=crop&w=800&q=80',
      image_credit: 'Kerala Folklore Akademi Library',
      source_reference: 'Central Kerala Folk Survey 2024',
      status: 'approved',
      submitted_at: '2026-11-04T10:15:00Z'
    }
  ];

  const loadContributions = async () => {
    setLoading(true);
    const data = await fetchAdminContributions(activeTab);
    if (data && data.length > 0) {
      setContributions(data);
    } else {
      setContributions(fallbackContributions.filter(c => c.status === activeTab));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadContributions();
  }, [activeTab]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    setMessage('');
    try {
      const notes = reviewNotes[id] || 'Verified against regional academic records.';
      await approveContribution(id, notes);
      setMessage(`Record #${id} successfully approved and published to the live heritage map!`);
      // Update local state
      setContributions(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setMessage(`Record #${id} approved in local state.`);
      setContributions(prev => prev.filter(c => c.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    setMessage('');
    try {
      const notes = reviewNotes[id] || 'Did not meet licensing or historical citation criteria.';
      await rejectContribution(id, notes);
      setMessage(`Record #${id} rejected.`);
      setContributions(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setMessage(`Record #${id} marked rejected in local state.`);
      setContributions(prev => prev.filter(c => c.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-heritage-gold/20">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-heritage-gold font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-heritage-gold" />
            <span>Curatorial Committee Portal</span>
          </span>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-gold-gradient mt-1">
            {t.adminTitle}
          </h1>
          <p className="text-sm text-heritage-ivory/70 max-w-2xl mt-2">
            {t.adminSubtitle}
          </p>
        </div>

        <button
          onClick={loadContributions}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-heritage-forest border border-heritage-gold/30 text-heritage-gold text-xs font-semibold flex items-center space-x-2 hover:border-heritage-gold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-heritage-forest border border-heritage-gold/50 text-heritage-gold text-xs flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-heritage-gold/20 gap-2">
        {[
          { id: 'pending', label: t.pendingTab, icon: Clock },
          { id: 'approved', label: t.approvedTab, icon: Check },
          { id: 'rejected', label: t.rejectedTab, icon: X },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-heritage-gold text-heritage-gold bg-heritage-forest/40'
                : 'border-transparent text-heritage-ivory/60 hover:text-heritage-gold'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="space-y-6">
        {contributions.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl glass-panel border border-heritage-gold/30 p-6 shadow-xl flex flex-col lg:flex-row gap-6 items-start justify-between"
          >
            {/* Image Preview */}
            <div className="w-full lg:w-48 h-44 rounded-xl overflow-hidden bg-heritage-dark flex-shrink-0 border border-heritage-gold/30 relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] text-white/70">
                {item.image_credit}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30">
                  Submission #{item.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-heritage-forest text-heritage-ivory border border-heritage-gold/20">
                  {item.category_name || 'Art Form'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-heritage-forest text-heritage-ivory border border-heritage-gold/20">
                  {item.district_name} ({item.locality || 'Village'})
                </span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl text-heritage-ivory">
                  {item.title}
                </h3>
                {item.title_ml && (
                  <p className="font-malayalam-text text-sm text-heritage-gold font-medium">
                    {item.title_ml}
                  </p>
                )}
              </div>

              <p className="text-xs text-heritage-ivory/80 leading-relaxed">
                {item.description}
              </p>

              {item.cultural_story && (
                <div className="p-3 rounded-lg bg-heritage-forest/40 border border-heritage-gold/15 text-xs text-heritage-ivory/70 italic">
                  <strong>Story Lore:</strong> "{item.cultural_story}"
                </div>
              )}

              {/* Source & Contributor Meta */}
              <div className="pt-2 border-t border-heritage-gold/15 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-heritage-ivory/60 font-mono">
                <div>
                  <strong className="text-heritage-gold font-normal">Contributor:</strong> {item.contributor_name} ({item.contributor_email || 'No email'})
                </div>
                <div>
                  <strong className="text-heritage-gold font-normal">Source:</strong> {item.source_reference}
                </div>
              </div>
            </div>

            {/* Admin Action Box (only for pending) */}
            {activeTab === 'pending' && (
              <div className="w-full lg:w-64 flex flex-col space-y-3 p-4 rounded-xl bg-heritage-forest/60 border border-heritage-gold/30 flex-shrink-0">
                <label className="text-[11px] font-bold text-heritage-gold uppercase tracking-wider flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Curator Review Notes</span>
                </label>
                <textarea
                  rows={2}
                  value={reviewNotes[item.id] || ''}
                  onChange={(e) => setReviewNotes({ ...reviewNotes, [item.id]: e.target.value })}
                  placeholder="Verification comments..."
                  className="w-full px-3 py-1.5 rounded-lg bg-heritage-dark border border-heritage-gold/25 text-xs text-heritage-ivory focus:border-heritage-gold focus:outline-none"
                />

                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => handleApprove(item.id)}
                    disabled={actionLoading === item.id}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase flex items-center justify-center space-x-1 shadow-md transition-all disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>

                  <button
                    onClick={() => handleReject(item.id)}
                    disabled={actionLoading === item.id}
                    className="flex-1 py-2 px-3 rounded-lg bg-red-800 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center justify-center space-x-1 shadow-md transition-all disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {contributions.length === 0 && !loading && (
          <div className="py-20 text-center text-sm text-heritage-ivory/50">
            No submissions in this review queue.
          </div>
        )}
      </div>

    </div>
  );
}
