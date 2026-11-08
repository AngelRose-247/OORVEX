import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { submitContribution } from '../services/api';
import {
  HeartHandshake, CheckCircle2, ShieldCheck, AlertCircle, Sparkles, Send, Loader2
} from 'lucide-react';

export default function ContributePage({ districts = [], categories = [] }) {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    contributor_name: '',
    contributor_email: '',
    title: '',
    title_ml: '',
    category: categories[0]?.slug || 'performing-arts',
    district: districts[0]?.slug || 'kannur',
    locality: '',
    description: '',
    description_ml: '',
    cultural_story: '',
    image: '',
    image_credit: '',
    source_reference: '',
    consent: false
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
      setErrorMessage('You must confirm cultural authenticity consent before submitting.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = {
        contributor_name: formData.contributor_name,
        contributor_email: formData.contributor_email,
        title: formData.title,
        title_ml: formData.title_ml,
        category: formData.category,
        district: formData.district,
        locality: formData.locality,
        description: formData.description,
        description_ml: formData.description_ml,
        cultural_story: formData.cultural_story,
        image: formData.image || '/images/placeholders/theyyam-showcase.jpg',
        image_credit: formData.image_credit,
        source_reference: formData.source_reference,
        consent: formData.consent,
      };

      const res = await submitContribution(payload);
      setSuccessMessage(t.submitSuccess);
      setFormData({
        contributor_name: '',
        contributor_email: '',
        title: '',
        title_ml: '',
        category: categories[0]?.slug || 'performing-arts',
        district: districts[0]?.slug || 'kannur',
        locality: '',
        description: '',
        description_ml: '',
        cultural_story: '',
        image: '',
        image_credit: '',
        source_reference: '',
        consent: false
      });
    } catch (err) {
      setErrorMessage('Failed to submit contribution. Please check required fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-heritage-ivory">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex p-3 rounded-full bg-heritage-palm text-heritage-maroon border border-heritage-gold/50 shadow-sm">
          <HeartHandshake className="w-6 h-6 text-heritage-terracotta" />
        </div>
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-heritage-maroon">
          {t.contributeTitle}
        </h1>
        <p className="text-sm text-heritage-timber/80 leading-relaxed font-normal">
          {t.contributeSubtitle}
        </p>
      </div>

      {/* Moderation Workflow Notice */}
      <div className="p-5 rounded-3xl bg-[#FFFBF2] border-2 border-heritage-gold/40 shadow-nalukettu flex items-start space-x-3 text-xs text-heritage-timber/85 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-heritage-templeGreen flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-heritage-maroon font-serif font-bold">Curator Verification Workflow:</strong> All community contributions enter a <code>PENDING</code> moderation queue. Once reviewed for cultural authenticity and licensing by the curation committee, approved listings appear immediately on the public map and CultureMatch AI.
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-center space-x-2 animate-fadeIn shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-10 rounded-3xl bg-[#FFFBF2] border-2 border-heritage-gold/40 shadow-nalukettu space-y-6">
        
        {/* Contributor Identity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
              {t.yourName} *
            </label>
            <input
              type="text"
              name="contributor_name"
              required
              value={formData.contributor_name}
              onChange={handleChange}
              placeholder="e.g. Anand K. Marar / Folk Arts Society"
              className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
              {t.yourEmail}
            </label>
            <input
              type="email"
              name="contributor_email"
              value={formData.contributor_email}
              onChange={handleChange}
              placeholder="e.g. anand@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Titles (English & Malayalam) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
              {t.titleEn} *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Kakkarissi Natakam"
              className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
              {t.titleMl}
            </label>
            <input
              type="text"
              name="title_ml"
              value={formData.title_ml}
              onChange={handleChange}
              placeholder="e.g. കാക്കാരിശ്ശി നാടകം"
              className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none font-malayalam-text shadow-sm"
            />
          </div>
        </div>

        {/* Classification & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
              {t.selectDistrict} *
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none shadow-sm font-medium"
            >
              {districts.map(d => (
                <option key={d.slug} value={d.slug}>
                  {language === 'ml' ? d.name_ml : d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
              {t.selectCategory} *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none shadow-sm font-medium"
            >
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>
                  {language === 'ml' ? c.name_ml : c.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
              {t.exactLocality}
            </label>
            <input
              type="text"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="e.g. Nedumangad Temple Grounds"
              className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none shadow-sm"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="space-y-1.5">
          <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
            {t.descriptionEn} *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the art, instruments, choreography, or craft technique..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none leading-relaxed shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
            {t.storyField}
          </label>
          <textarea
            name="cultural_story"
            rows={3}
            value={formData.cultural_story}
            onChange={handleChange}
            placeholder="Oral folklore, village origins, rituals, or mythological backstory..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none leading-relaxed shadow-sm"
          />
        </div>

        {/* Image & Source Citations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
              {t.imageUrl} *
            </label>
            <input
              type="url"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              placeholder="https://... (High resolution authentic URL)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
              {t.imageCredit} *
            </label>
            <input
              type="text"
              name="image_credit"
              required
              value={formData.image_credit}
              onChange={handleChange}
              placeholder="e.g. Wikimedia Commons / Contributor Photo"
              className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-serif font-bold text-heritage-maroon uppercase tracking-wider">
            {t.sourceRef} *
          </label>
          <input
            type="text"
            name="source_reference"
            required
            value={formData.source_reference}
            onChange={handleChange}
            placeholder="e.g. Kerala Folklore Akademi Journal Vol. 14 / Hereditary family lineage"
            className="w-full px-3.5 py-2.5 rounded-xl bg-heritage-ivory border border-heritage-gold/50 text-heritage-timber text-xs focus:border-heritage-terracotta focus:outline-none shadow-sm"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start space-x-3 cursor-pointer text-xs text-heritage-timber">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 text-heritage-terracotta rounded bg-heritage-ivory border-heritage-gold/60 focus:ring-0"
            />
            <span className="leading-relaxed">{t.consentCheckbox}</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-[#C6A15B] hover:bg-[#AB8742] text-[#123B32] font-serif font-bold text-xs uppercase tracking-wider shadow-kasavu flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.submitBtn}</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
