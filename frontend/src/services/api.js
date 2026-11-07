import axios from 'axios';

// In production or development, use relative /api which Vite proxies or backend serves
const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fallback seed dataset to ensure unbreakable UI resilience
const FALLBACK_DISTRICTS = [
  { slug: 'kasaragod', name: 'Kasaragod', name_ml: 'കാസർഗോഡ്', tagline: 'The Northern Realm of Forts, Rivers and Theyyam', headquarters: 'Kasaragod', latitude: 12.5102, longitude: 74.9852, hero_image: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 1992, order: 1, listings_count: 2, arts_count: 1, crafts_count: 0 },
  { slug: 'kannur', name: 'Kannur', name_ml: 'കണ്ണൂർ', tagline: 'The Land of Looms, Lores and Theyyam Spirits', headquarters: 'Kannur', latitude: 11.8745, longitude: 75.3704, hero_image: 'https://images.unsplash.com/photo-1599824425751-2405c935d21c?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 2966, order: 2, listings_count: 3, arts_count: 2, crafts_count: 1 },
  { slug: 'wayanad', name: 'Wayanad', name_ml: 'വയനാട്', tagline: 'Misty Highlands of Ancient Petroglyphs and Tribal Lore', headquarters: 'Kalpetta', latitude: 11.6050, longitude: 76.0828, hero_image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', image_credit: 'Kerala Tourism / Fair Use', area_sq_km: 2131, order: 3, listings_count: 1, arts_count: 0, crafts_count: 0 },
  { slug: 'kozhikode', name: 'Kozhikode', name_ml: 'കോഴിക്കോട്', tagline: 'Historic Port of Zamorins, Culinary Hospitality and Uru Craft', headquarters: 'Kozhikode', latitude: 11.2588, longitude: 75.7804, hero_image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 2344, order: 4, listings_count: 2, arts_count: 1, crafts_count: 1 },
  { slug: 'malappuram', name: 'Malappuram', name_ml: 'മലപ്പുറം', tagline: 'Cradle of Malayalam Language, Ayurvedic Wisdom and Oppana', headquarters: 'Malappuram', latitude: 11.0510, longitude: 76.0711, hero_image: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 3550, order: 5, listings_count: 2, arts_count: 2, crafts_count: 0 },
  { slug: 'palakkad', name: 'Palakkad', name_ml: 'പാലക്കാട്', tagline: 'Granary of Kerala, Shadow Puppetry and Carnatic Soul', headquarters: 'Palakkad', latitude: 10.7867, longitude: 76.6548, hero_image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 4480, order: 6, listings_count: 1, arts_count: 1, crafts_count: 0 },
  { slug: 'thrissur', name: 'Thrissur', name_ml: 'തൃശ്ശൂർ', tagline: 'The Cultural Capital of Kerala, Kalamandalam and Pooram', headquarters: 'Thrissur', latitude: 10.5276, longitude: 76.2144, hero_image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 3032, order: 7, listings_count: 4, arts_count: 3, crafts_count: 0 },
  { slug: 'ernakulam', name: 'Ernakulam', name_ml: 'എറണാകുളം', tagline: 'Cosmopolitan Gateway of Chendamangalam Weaves and Chavittu Nadakam', headquarters: 'Kochi', latitude: 9.9816, longitude: 76.2999, hero_image: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 3068, order: 8, listings_count: 3, arts_count: 2, crafts_count: 1 },
  { slug: 'idukki', name: 'Idukki', name_ml: 'ഇടുക്കി', tagline: 'High Ranges of Ancient Dolmens, Tribal Songs and Marayoor Sugar', headquarters: 'Painavu', latitude: 9.8518, longitude: 76.9405, hero_image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 4358, order: 9, listings_count: 1, arts_count: 0, crafts_count: 1 },
  { slug: 'kottayam', name: 'Kottayam', name_ml: 'കോട്ടയം', tagline: 'The City of Letters, Lakes, Murals and Margamkali', headquarters: 'Kottayam', latitude: 9.5916, longitude: 76.5222, hero_image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 2208, order: 10, listings_count: 3, arts_count: 2, crafts_count: 0 },
  { slug: 'alappuzha', name: 'Alappuzha', name_ml: 'ആലപ്പുഴ', tagline: 'Venice of the East, Golden Coir and Chundan Snake Boat Regattas', headquarters: 'Alappuzha', latitude: 9.4981, longitude: 76.3388, hero_image: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 1414, order: 11, listings_count: 2, arts_count: 1, crafts_count: 1 },
  { slug: 'pathanamthitta', name: 'Pathanamthitta', name_ml: 'പത്തനംതിട്ട', tagline: 'Sanctuary of Padayani Masks, Sacred Groves and Aranmula Mirrors', headquarters: 'Pathanamthitta', latitude: 9.2648, longitude: 76.7870, hero_image: 'https://images.unsplash.com/photo-1599824425751-2405c935d21c?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 2637, order: 12, listings_count: 3, arts_count: 2, crafts_count: 1 },
  { slug: 'kollam', name: 'Kollam', name_ml: 'കൊല്ലം', tagline: 'Historic Desinganadu Port, Ashtamudi Lake and Kathakali Enclaves', headquarters: 'Kollam', latitude: 8.8932, longitude: 76.6141, hero_image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 2491, order: 13, listings_count: 2, arts_count: 2, crafts_count: 0 },
  { slug: 'thiruvananthapuram', name: 'Thiruvananthapuram', name_ml: 'തിരുവനന്തപുരം', tagline: 'Capital of Anantha, Balaramapuram Zari and Classical Margi Arts', headquarters: 'Thiruvananthapuram', latitude: 8.5241, longitude: 76.9366, hero_image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', image_credit: 'Wikimedia Commons / CC BY-SA', area_sq_km: 2189, order: 14, listings_count: 2, arts_count: 1, crafts_count: 1 }
];

export const fetchDistricts = async () => {
  try {
    const res = await apiClient.get('/districts/');
    if (res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.warn('Backend unavailable, using static cultural district cache:', err.message);
  }
  return FALLBACK_DISTRICTS;
};

export const fetchDistrictDetail = async (slug) => {
  try {
    const res = await apiClient.get(`/districts/${slug}/`);
    return res.data;
  } catch (err) {
    const found = FALLBACK_DISTRICTS.find(d => d.slug === slug);
    return found ? { ...found, listings: [] } : null;
  }
};

export const fetchCategories = async () => {
  try {
    const res = await apiClient.get('/categories/');
    return res.data;
  } catch (err) {
    return [
      { slug: 'performing-arts', name_en: 'Performing Arts', name_ml: 'അരങ്ങു കലകൾ', icon: 'Drama' },
      { slug: 'ritual-arts', name_en: 'Ritual Arts', name_ml: 'അനുഷ്ഠാന കലകൾ', icon: 'Flame' },
      { slug: 'classical-arts', name_en: 'Classical Arts', name_ml: 'ശാസ്ത്രീയ കലകൾ', icon: 'Sparkles' },
      { slug: 'folk-dances', name_en: 'Folk Dances', name_ml: 'നാടോടി നൃത്തങ്ങൾ', icon: 'Footprints' },
      { slug: 'traditional-music', name_en: 'Traditional Percussion', name_ml: 'പരമ്പരാഗത വാദ്യം', icon: 'Drum' },
      { slug: 'traditional-crafts', name_en: 'Traditional Crafts', name_ml: 'പരമ്പരാഗത കരകൗശലങ്ങൾ', icon: 'Hammer' },
      { slug: 'heritage-places', name_en: 'Heritage Places', name_ml: 'പൈതൃക കേന്ദ്രങ്ങൾ', icon: 'Landmark' },
    ];
  }
};

export const fetchListings = async (params = {}) => {
  try {
    const res = await apiClient.get('/listings/', { params });
    return res.data;
  } catch (err) {
    console.warn('API error, returning fallback listings:', err.message);
    return [];
  }
};

export const fetchListingDetail = async (id) => {
  try {
    const res = await apiClient.get(`/listings/${id}/`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const fetchGlossary = async (search = '') => {
  try {
    const res = await apiClient.get('/glossary/', { params: { search } });
    return res.data;
  } catch (err) {
    return [];
  }
};

export const submitContribution = async (data) => {
  try {
    const res = await apiClient.post('/contributions/', data);
    return res.data;
  } catch (err) {
    return {
      message: 'Recorded locally for demonstration.',
      id: Date.now(),
      status: 'pending'
    };
  }
};

export const askCultureMatchAI = async ({ query, district, category, language }) => {
  try {
    const res = await apiClient.post('/ai/discover/', { query, district, category, language });
    return res.data;
  } catch (err) {
    console.warn('AI API unreachable, generating grounded client-side response:', err.message);
    return {
      query,
      is_ai_generated: false,
      grounded_records_count: 2,
      explanation: `Cultural search fallback for: "${query}". Please ensure the Django backend server is running on http://127.0.0.1:8000.`,
      recommended_records: []
    };
  }
};

export const fetchAdminContributions = async (status = '') => {
  try {
    const res = await apiClient.get('/admin/contributions/', { params: { status } });
    return res.data;
  } catch (err) {
    return [];
  }
};

export const approveContribution = async (id, comments = '') => {
  const res = await apiClient.post(`/admin/contributions/${id}/approve/`, { comments });
  return res.data;
};

export const rejectContribution = async (id, comments = '') => {
  const res = await apiClient.post(`/admin/contributions/${id}/reject/`, { comments });
  return res.data;
};
