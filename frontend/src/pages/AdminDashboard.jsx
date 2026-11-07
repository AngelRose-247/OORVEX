import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  fetchAdminContributions,
  approveContribution,
  rejectContribution,
  updateArtFormImage,
  updateCuratorStatus,
  fetchListings
} from '../services/api';
import {
  ShieldCheck, Check, X, Clock, AlertCircle, Eye, ExternalLink,
  RefreshCw, MessageSquare, Camera, Upload, Image as ImageIcon,
  Sparkles, Save, Filter, ChevronRight, CheckCircle2, HelpCircle
} from 'lucide-react';

export default function AdminDashboard({ onNavigate, listings: propListings = [] }) {
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('curation'); // 'curation' | 'pending' | 'approved' | 'rejected'
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [reviewNotes, setReviewNotes] = useState({});
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Art-Form Curation State
  const [artForms, setArtForms] = useState(propListings || []);
  const [selectedArtFormId, setSelectedArtFormId] = useState(propListings[0]?.id || 1);
  const [searchTerm, setSearchTerm] = useState('');

  // Image Upload & Replacement Form State
  const [imageForm, setImageForm] = useState({
    image_url: '',
    caption: '',
    alt_text: '',
    photographer: '',
    source_url: '',
    licence: 'CC BY-SA 4.0',
    district_locality: '',
    is_primary: true
  });
  const [imageSaving, setImageSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  // Load art forms if not provided via props
  useEffect(() => {
    let isMounted = true;
    const loadListings = async () => {
      if (propListings.length > 0) {
        setArtForms(propListings);
        if (!selectedArtFormId && propListings[0]) {
          setSelectedArtFormId(propListings[0].id);
        }
      } else {
        const data = await fetchListings();
        if (data && data.length > 0 && isMounted) {
          setArtForms(data);
          setSelectedArtFormId(data[0].id);
        }
      }
    };
    loadListings();
    return () => { isMounted = false; };
  }, [propListings]);

  const selectedArtForm = artForms.find(af => String(af.id) === String(selectedArtFormId)) || artForms[0];

  // Sync imageForm with selectedArtForm when it changes
  useEffect(() => {
    if (selectedArtForm) {
      setImageForm({
        image_url: selectedArtForm.image || '',
        caption: `${selectedArtForm.title} authentic documentation`,
        alt_text: `Authentic representation of ${selectedArtForm.title} cultural heritage in Kerala.`,
        photographer: selectedArtForm.image_credit || 'Wikimedia Commons',
        source_url: 'https://www.keralatourism.org/artforms/',
        licence: 'CC BY-SA 4.0',
        district_locality: selectedArtForm.locality || selectedArtForm.origin_district_name || 'Kerala',
        is_primary: true
      });
    }
  }, [selectedArtFormId, selectedArtForm]);

  const loadContributions = async () => {
    setLoading(true);
    const data = await fetchAdminContributions(activeTab);
    if (data && data.length > 0) {
      setContributions(data);
    } else {
      setContributions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab !== 'curation') {
      loadContributions();
    }
  }, [activeTab]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    setMessage('');
    setErrorMessage('');
    try {
      const notes = reviewNotes[id] || 'Verified against regional academic records.';
      await approveContribution(id, notes);
      setMessage(`Record #${id} successfully approved and published to the live heritage map!`);
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
    setErrorMessage('');
    try {
      const notes = reviewNotes[id] || 'Did not meet licensing or historical citation criteria.';
      await rejectContribution(id, notes);
      setMessage(`Record #${id} marked as rejected.`);
      setContributions(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setMessage(`Record #${id} marked rejected in local state.`);
      setContributions(prev => prev.filter(c => c.id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  // Curator Status Update Handler
  const handleStatusChange = async (newStatus) => {
    if (!selectedArtForm) return;
    setStatusSaving(true);
    setMessage('');
    setErrorMessage('');
    try {
      await updateCuratorStatus(selectedArtForm.id, newStatus);
      // Update local state
      setArtForms(prev => prev.map(af => (
        af.id === selectedArtForm.id ? { ...af, curator_status: newStatus } : af
      )));
      setMessage(`Updated curator verification tier for "${selectedArtForm.title}" to ${newStatus}.`);
    } catch (err) {
      setErrorMessage(`Failed to update status on server: ${err.message}`);
    } finally {
      setStatusSaving(false);
    }
  };

  // Image Upload & Replacement Handler
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArtForm) return;
    setImageSaving(true);
    setMessage('');
    setErrorMessage('');
    try {
      await updateArtFormImage(selectedArtForm.id, imageForm);
      // Update local state
      setArtForms(prev => prev.map(af => (
        af.id === selectedArtForm.id
          ? { ...af, image: imageForm.image_url, image_credit: imageForm.photographer }
          : af
      )));
      setMessage(`Successfully replaced and published verified image metadata for "${selectedArtForm.title}"!`);
    } catch (err) {
      setErrorMessage(`Failed to save replacement image: ${err.message}`);
    } finally {
      setImageSaving(false);
    }
  };

  const filteredArtForms = artForms.filter(af =>
    af.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (af.title_ml && af.title_ml.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#F7F0DF]">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#C6A15B]/30">
        <div>
          <span className="text-xs uppercase font-serif tracking-widest text-[#A64F32] font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#A64F32]" />
            <span>Curatorial Verification & Media Administration</span>
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#702D2B] mt-1">
            Curatorial Committee Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#392A20]/80 max-w-2xl mt-1.5 leading-relaxed font-sans">
            Review community records, assign strict 3-tier curator verification status, and manage authentic Creative Commons photographic assets.
          </p>
        </div>

        <button
          onClick={() => {
            if (activeTab === 'curation') {
              fetchListings().then(data => { if (data) setArtForms(data); });
            } else {
              loadContributions();
            }
          }}
          className="self-start md:self-auto px-4 py-2 rounded-xl bg-[#FFFDF6] border border-[#C6A15B]/50 text-[#702D2B] text-xs font-serif font-bold flex items-center space-x-2 hover:bg-[#E8D8B8] shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#A64F32]" />
          <span>Refresh Records</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-[#E8D8B8]/60 border border-[#31543E]/40 text-[#103B30] text-xs flex items-center space-x-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#31543E] flex-shrink-0" />
          <span className="font-medium">{message}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-center space-x-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-[#C6A15B]/30 gap-2 overflow-x-auto pb-px">
        {[
          { id: 'curation', label: 'Art Forms & Media Curation', icon: Camera },
          { id: 'pending', label: 'Pending Contributions', icon: Clock },
          { id: 'approved', label: 'Approved Archives', icon: Check },
          { id: 'rejected', label: 'Archived / Rejected', icon: X },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-xs font-serif font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#702D2B] text-[#702D2B] bg-[#FFFDF6]'
                : 'border-transparent text-[#392A20]/60 hover:text-[#702D2B]'
            }`}
          >
            <tab.icon className="w-4 h-4 text-[#A64F32]" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. TAB 1: ART FORM CURATION & IMAGE UPLOAD WORKFLOW */}
      {activeTab === 'curation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Art Form Directory (4 Cols) */}
          <div className="lg:col-span-4 rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 p-5 shadow-nalukettu space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#C6A15B]/25">
              <span className="font-serif font-bold text-sm text-[#405B43] flex items-center space-x-1.5">
                <Filter className="w-4 h-4 text-[#A64F32]" />
                <span>Select Art Form ({artForms.length})</span>
              </span>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search art form name..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/40 text-xs text-[#392A20] focus:border-[#405B43] focus:outline-none"
            />

            <div className="max-h-[560px] overflow-y-auto space-y-1.5 pr-1">
              {filteredArtForms.map(af => (
                <button
                  key={af.id}
                  onClick={() => setSelectedArtFormId(af.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all flex items-center justify-between ${
                    String(selectedArtFormId) === String(af.id)
                      ? 'bg-[#E8D8B8] border border-[#A64F32] text-[#702D2B] font-bold shadow-sm'
                      : 'hover:bg-[#F7F0DF] text-[#392A20]/80'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="truncate font-serif">{af.title}</div>
                    {af.title_ml && (
                      <div className="text-[10px] text-[#A64F32] truncate">{af.title_ml}</div>
                    )}
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold flex-shrink-0 ${
                    af.curator_status === 'Verified' ? 'bg-[#31543E] text-white' : 'bg-[#B58A45] text-white'
                  }`}>
                    {af.curator_status || 'Verified'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Art Form Curation & Image Replacement (8 Cols) */}
          {selectedArtForm ? (
            <div className="lg:col-span-8 space-y-8">
              
              {/* Card 1: Curator Verification Status Toggling */}
              <div className="rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 p-6 shadow-nalukettu space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C6A15B]/25">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#A64F32] font-bold">
                      Record #{selectedArtForm.id} • {selectedArtForm.category?.name_en || 'Art Form'}
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-[#702D2B]">
                      {selectedArtForm.title} {selectedArtForm.title_ml && `(${selectedArtForm.title_ml})`}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-serif text-[#392A20]/70">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold shadow-sm ${
                      selectedArtForm.curator_status === 'Verified' ? 'bg-[#31543E] text-white' :
                      selectedArtForm.curator_status === 'Needs Review' ? 'bg-[#B58A45] text-white' :
                      'bg-[#5A6268] text-white'
                    }`}>
                      {selectedArtForm.curator_status || 'Verified'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-serif font-bold text-[#405B43] uppercase tracking-wider block">
                    Change Verification Tier:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleStatusChange('Verified')}
                      disabled={statusSaving || selectedArtForm.curator_status === 'Verified'}
                      className="p-3 rounded-xl border border-[#31543E] bg-[#31543E]/10 hover:bg-[#31543E] hover:text-white text-[#31543E] font-serif font-bold text-xs flex items-center justify-center space-x-1.5 transition-all disabled:opacity-40"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange('Needs Review')}
                      disabled={statusSaving || selectedArtForm.curator_status === 'Needs Review'}
                      className="p-3 rounded-xl border border-[#B58A45] bg-[#B58A45]/10 hover:bg-[#B58A45] hover:text-white text-[#B58A45] font-serif font-bold text-xs flex items-center justify-center space-x-1.5 transition-all disabled:opacity-40"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Needs Review</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange('Unverified Demo Content')}
                      disabled={statusSaving || selectedArtForm.curator_status === 'Unverified Demo Content'}
                      className="p-3 rounded-xl border border-gray-400 bg-gray-100 hover:bg-gray-600 hover:text-white text-gray-700 font-serif font-bold text-xs flex items-center justify-center space-x-1.5 transition-all disabled:opacity-40"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Unverified Demo</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#392A20]/70 font-sans italic pt-1">
                    * Only "Verified" records are featured on public verification badges and grounded CultureMatch AI discoveries.
                  </p>
                </div>
              </div>

              {/* Card 2: Image Upload & Replacement with Metadata */}
              <form
                onSubmit={handleImageSubmit}
                className="rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 p-6 sm:p-7 shadow-nalukettu space-y-6"
              >
                <div className="pb-3 border-b border-[#C6A15B]/25 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-[#405B43]">
                    <Camera className="w-5 h-5 text-[#A64F32]" />
                    <h3 className="font-serif font-bold text-xl">
                      Image Upload & Metadata Replacement
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#A64F32] font-bold bg-[#E8D8B8] px-2.5 py-1 rounded-full">
                    Sourced CC Asset
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  
                  {/* Left: Live Image Preview */}
                  <div className="space-y-3">
                    <label className="text-xs font-serif font-bold text-[#405B43] uppercase tracking-wider block">
                      Live Image Preview
                    </label>
                    <div className="h-56 w-full rounded-2xl overflow-hidden bg-[#E8D8B8] border border-[#C6A15B]/40 relative">
                      {imageForm.image_url ? (
                        <img
                          src={imageForm.image_url}
                          alt={imageForm.alt_text || 'Preview'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-[#392A20]/50 font-serif">
                          No image URL provided
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                        {imageForm.licence || 'CC BY-SA 4.0'}
                      </div>
                    </div>

                    <div className="text-[11px] text-[#392A20]/80 space-y-1 bg-[#F7F0DF] p-3 rounded-xl border border-[#C6A15B]/30 font-sans">
                      <div><strong className="text-[#405B43]">Caption:</strong> {imageForm.caption || 'None'}</div>
                      <div><strong className="text-[#405B43]">Photographer:</strong> {imageForm.photographer || 'Uncredited'}</div>
                    </div>
                  </div>

                  {/* Right: Metadata Inputs */}
                  <div className="space-y-3.5 text-xs">
                    <div>
                      <label className="font-serif font-bold text-[#405B43] block mb-1">
                        Image URL (High-Resolution CC Photo) *
                      </label>
                      <input
                        type="url"
                        required
                        value={imageForm.image_url}
                        onChange={(e) => setImageForm({ ...imageForm, image_url: e.target.value })}
                        placeholder="https://upload.wikimedia.org/... or verified CDN URL"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#C6A15B]/40 text-[#392A20] focus:border-[#405B43] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-serif font-bold text-[#405B43] block mb-1">
                        Caption *
                      </label>
                      <input
                        type="text"
                        required
                        value={imageForm.caption}
                        onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })}
                        placeholder="e.g. Muchilot Bhagavathi Theyyam nocturnal invocation in Kannur"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#C6A15B]/40 text-[#392A20] focus:border-[#405B43] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-serif font-bold text-[#405B43] block mb-1">
                        Descriptive Alt Text (Accessibility) *
                      </label>
                      <input
                        type="text"
                        required
                        value={imageForm.alt_text}
                        onChange={(e) => setImageForm({ ...imageForm, alt_text: e.target.value })}
                        placeholder="e.g. Performer in towering Mudi headgear and red face paint leaping before fire pyre"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#C6A15B]/40 text-[#392A20] focus:border-[#405B43] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-serif font-bold text-[#405B43] block mb-1">
                          Photographer / Source *
                        </label>
                        <input
                          type="text"
                          required
                          value={imageForm.photographer}
                          onChange={(e) => setImageForm({ ...imageForm, photographer: e.target.value })}
                          placeholder="e.g. Jean-Pierre Dalbéra"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#C6A15B]/40 text-[#392A20] focus:border-[#405B43] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-serif font-bold text-[#405B43] block mb-1">
                          License Note *
                        </label>
                        <select
                          value={imageForm.licence}
                          onChange={(e) => setImageForm({ ...imageForm, licence: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-[#C6A15B]/40 text-[#392A20] focus:border-[#405B43] focus:outline-none"
                        >
                          <option value="CC BY-SA 4.0">CC BY-SA 4.0</option>
                          <option value="CC BY-SA 3.0">CC BY-SA 3.0</option>
                          <option value="CC BY 2.0">CC BY 2.0</option>
                          <option value="Public Domain">Public Domain</option>
                          <option value="Fair Use Archival">Fair Use Archival</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-serif font-bold text-[#405B43] block mb-1">
                        Original Media Source URL
                      </label>
                      <input
                        type="url"
                        value={imageForm.source_url}
                        onChange={(e) => setImageForm({ ...imageForm, source_url: e.target.value })}
                        placeholder="https://commons.wikimedia.org/wiki/File:..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#C6A15B]/40 text-[#392A20] focus:border-[#405B43] focus:outline-none"
                      />
                    </div>
                  </div>

                </div>

                <div className="pt-3 border-t border-[#C6A15B]/20 flex justify-end">
                  <button
                    type="submit"
                    disabled={imageSaving}
                    className="px-6 py-2.5 rounded-xl bg-[#A64F32] hover:bg-[#8D3F26] text-white font-serif font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-sm transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{imageSaving ? 'Saving Image...' : 'Save & Publish Image'}</span>
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="lg:col-span-8 p-12 rounded-3xl bg-[#FFFDF6] border border-[#C6A15B]/40 text-center text-sm font-serif text-[#392A20]/60">
              Select an art form on the left to curate its metadata and photographs.
            </div>
          )}

        </div>
      )}

      {/* 4. TAB 2, 3, 4: COMMUNITY SUBMISSION REVIEW WORKFLOW */}
      {activeTab !== 'curation' && (
        <div className="space-y-6">
          {contributions.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#FFFDF6] border-2 border-[#C6A15B]/40 p-6 shadow-nalukettu flex flex-col lg:flex-row gap-6 items-start justify-between"
            >
              {/* Image Preview */}
              <div className="w-full lg:w-48 h-44 rounded-2xl overflow-hidden bg-[#E8D8B8] flex-shrink-0 border border-[#C6A15B]/35 relative shadow-sm">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white/80">
                  {item.image_credit}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-3 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E8D8B8] border border-[#C6A15B]/40 text-[#702D2B]">
                    Submission #{item.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#F7F0DF] border border-[#C6A15B]/30 text-[#392A20]">
                    {item.category_name || 'Art Form'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#F7F0DF] border border-[#C6A15B]/30 text-[#392A20]">
                    {item.district_name} ({item.locality || 'Village'})
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-xl text-[#702D2B]">
                    {item.title}
                  </h3>
                  {item.title_ml && (
                    <p className="font-serif text-sm text-[#A64F32] font-semibold">
                      {item.title_ml}
                    </p>
                  )}
                </div>

                <p className="text-xs text-[#392A20]/85 leading-relaxed">
                  {item.description}
                </p>

                {item.cultural_story && (
                  <div className="p-3.5 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/25 text-xs text-[#392A20]/80 italic leading-relaxed">
                    <strong className="text-[#702D2B] font-serif not-italic">Oral Lore:</strong> "{item.cultural_story}"
                  </div>
                )}

                {/* Source & Contributor Meta */}
                <div className="pt-2 border-t border-[#C6A15B]/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#392A20]/70 font-mono">
                  <div>
                    <strong className="text-[#702D2B] font-serif">Contributor:</strong> {item.contributor_name} ({item.contributor_email || 'No email'})
                  </div>
                  <div>
                    <strong className="text-[#702D2B] font-serif">Source:</strong> {item.source_reference}
                  </div>
                </div>
              </div>

              {/* Admin Action Box (only for pending) */}
              {activeTab === 'pending' && (
                <div className="w-full lg:w-64 flex flex-col space-y-3 p-4 rounded-2xl bg-[#F7F0DF] border border-[#C6A15B]/40 flex-shrink-0 shadow-sm">
                  <label className="text-[11px] font-serif font-bold text-[#702D2B] uppercase tracking-wider flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-[#A64F32]" />
                    <span>Curator Verification Notes</span>
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNotes[item.id] || ''}
                    onChange={(e) => setReviewNotes({ ...reviewNotes, [item.id]: e.target.value })}
                    placeholder="Verification comments..."
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#C6A15B]/40 text-xs text-[#392A20] focus:border-[#A64F32] focus:outline-none shadow-sm"
                  />

                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={actionLoading === item.id}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#405B43] hover:bg-[#31543E] text-white font-serif font-bold text-xs uppercase flex items-center justify-center space-x-1 shadow-sm transition-all disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => handleReject(item.id)}
                      disabled={actionLoading === item.id}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#702D2B] hover:bg-[#5C2322] text-white font-serif font-bold text-xs uppercase flex items-center justify-center space-x-1 shadow-sm transition-all disabled:opacity-50"
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
            <div className="py-20 text-center text-sm text-[#392A20]/60 bg-[#FFFDF6] rounded-3xl border border-dashed border-[#C6A15B]/40">
              No submissions in this review queue.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
