import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import keralaGeoJson from '../assets/kerala_districts.json';
import {
  Search, Filter, MapPin, Eye, Compass, Layers, ExternalLink,
  Sparkles, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import SafeImage from './SafeImage';

// Custom antique brass lamp marker icon for cultural locations
const createCulturalIcon = (isFeatured = false) => {
  return L.divIcon({
    className: 'custom-cultural-pin',
    html: `
      <div style="
        width: ${isFeatured ? '36px' : '30px'};
        height: ${isFeatured ? '36px' : '30px'};
        background: ${isFeatured ? '#A64F32' : '#FFFDF6'};
        border: 2px solid ${isFeatured ? '#C6A15B' : '#405B43'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${isFeatured ? '#FFFDF6' : '#405B43'};
        font-size: ${isFeatured ? '16px' : '13px'};
        box-shadow: 0 4px 12px rgba(57, 42, 32, 0.25);
        cursor: pointer;
        transition: transform 0.2s ease;
      ">
        ${isFeatured ? '🪔' : '✦'}
      </div>
    `,
    iconSize: isFeatured ? [36, 36] : [30, 30],
    iconAnchor: isFeatured ? [18, 18] : [15, 15],
    popupAnchor: [0, -18]
  });
};

function MapFlyController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 9, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function KeralaMap({ districts = [], listings = [], categories = [], onNavigate }) {
  const { language, t } = useLanguage();
  const { recordDistrictVisit } = usePassport();

  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState([10.4, 76.4]);
  const [mapZoom, setMapZoom] = useState(7);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const filteredListings = listings.filter((item) => {
    const matchesCat = !selectedCategory || (item.category && item.category.slug === selectedCategory);
    const matchesDistrict = !selectedDistrict || (item.districts && item.districts.some(d => d.slug === selectedDistrict.slug));
    const matchesSearch = !searchQuery || (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.title_ml && item.title_ml.includes(searchQuery)) ||
      (item.locality && item.locality.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return matchesCat && matchesDistrict && matchesSearch;
  });

  const onEachDistrict = (feature, layer) => {
    const { slug, name, name_ml } = feature.properties;

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 2.5,
          color: '#405B43',
          fillColor: '#C6A15B',
          fillOpacity: 0.45,
        });
      },
      mouseout: (e) => {
        const target = e.target;
        const isCurrent = selectedDistrict && selectedDistrict.slug === slug;
        target.setStyle({
          weight: isCurrent ? 2.5 : 1.5,
          color: isCurrent ? '#405B43' : '#A64F32',
          fillColor: isCurrent ? '#A64F32' : '#E8D8B8',
          fillOpacity: isCurrent ? 0.35 : 0.22,
        });
      },
      click: () => {
        handleSelectDistrict(slug);
      }
    });

    layer.bindTooltip(
      `<strong>${language === 'ml' ? name_ml : name}</strong>`,
      { permanent: false, direction: 'center', className: 'bg-[#FFFDF6] text-xs text-[#405B43] font-serif font-bold px-2 py-1 border border-[#C6A15B] rounded shadow-sm' }
    );
  };

  const handleSelectDistrict = (districtSlug) => {
    const dist = districts.find(d => d.slug === districtSlug) || {
      slug: districtSlug,
      name: districtSlug.charAt(0).toUpperCase() + districtSlug.slice(1),
      name_ml: districtSlug,
      latitude: 10.5,
      longitude: 76.2
    };

    setSelectedDistrict(dist);
    recordDistrictVisit(dist.slug);
    setMapCenter([dist.latitude, dist.longitude]);
    setMapZoom(9);
    setIsSidePanelOpen(true);
  };

  const clearSelection = () => {
    setSelectedDistrict(null);
    setSelectedCategory('');
    setSearchQuery('');
    setMapCenter([10.4, 76.4]);
    setMapZoom(7);
    setIsSidePanelOpen(false);
  };

  return (
    <div className="relative w-full h-[760px] rounded-3xl overflow-hidden border-2 border-[#C6A15B]/40 shadow-nalukettu-lg bg-[#F7F0DF] flex flex-col">
      
      {/* Top Filter and Search Bar */}
      <div className="z-20 w-full bg-[#FFFDF6] px-4 py-3 border-b border-[#C6A15B]/30 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-[#A64F32] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/40 text-[#392A20] placeholder-[#392A20]/50 focus:border-[#405B43] focus:outline-none"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'bg-[#405B43] text-white shadow-sm'
                : 'bg-[#E8D8B8]/60 text-[#392A20] border border-[#C6A15B]/40 hover:bg-[#E8D8B8]'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.slug
                  ? 'bg-[#405B43] text-white shadow-sm'
                  : 'bg-[#E8D8B8]/60 text-[#392A20] border border-[#C6A15B]/40 hover:bg-[#E8D8B8]'
              }`}
            >
              {language === 'ml' ? c.name_ml : c.name_en}
            </button>
          ))}
        </div>

        {/* Clear Filters Button */}
        {(selectedDistrict || selectedCategory || searchQuery) && (
          <button
            onClick={clearSelection}
            className="px-2.5 py-1.5 rounded-lg bg-[#A64F32]/15 border border-[#A64F32]/40 text-[#A64F32] font-semibold text-xs flex items-center space-x-1 hover:bg-[#A64F32]/25"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t.clearFilters}</span>
          </button>
        )}
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapFlyController center={mapCenter} zoom={mapZoom} />

          {/* OpenStreetMap Base Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | OORVEX Living Culture Map'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Kerala 14 Districts GeoJSON Boundary Polygons */}
          <GeoJSON
            data={keralaGeoJson}
            onEachFeature={onEachDistrict}
            style={(feature) => {
              const isSelected = selectedDistrict && selectedDistrict.slug === feature.properties.slug;
              return {
                fillColor: isSelected ? '#A64F32' : '#E8D8B8',
                weight: isSelected ? 2.5 : 1.5,
                opacity: 0.9,
                color: isSelected ? '#405B43' : '#A64F32',
                fillOpacity: isSelected ? 0.35 : 0.22,
              };
            }}
          />

          {/* Cultural Location Markers with Grounded Popups */}
          {filteredListings.map((listing) => {
            if (!listing.latitude || !listing.longitude) return null;
            return (
              <Marker
                key={listing.id}
                position={[listing.latitude, listing.longitude]}
                icon={createCulturalIcon(listing.is_featured)}
              >
                <Popup>
                  <div className="p-1 space-y-2 max-w-[260px]">
                    {listing.image && (
                      <SafeImage
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-28 object-cover rounded-lg border border-[#C6A15B]/30"
                        loading="lazy"
                      />
                    )}
                    <div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#E8D8B8] border border-[#C6A15B]/40 text-[#405B43] font-bold">
                        {listing.category?.name_en || 'Heritage'}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#405B43] pt-1">
                        {language === 'ml' ? listing.title_ml : listing.title}
                      </h4>
                      <p className="text-xs text-[#392A20]/80 flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#A64F32] inline" />
                        <span>{listing.locality || 'Kerala'}</span>
                      </p>
                    </div>

                    <p className="text-[11px] text-[#392A20]/75 line-clamp-2">
                      {language === 'ml' ? listing.description_ml : listing.description_en}
                    </p>

                    <button
                      onClick={() => onNavigate(`/cultural-listings/${listing.id}`)}
                      className="w-full py-1.5 px-3 rounded-xl bg-[#C6A15B] hover:bg-[#AB8742] text-[#123B32] font-serif font-bold text-xs flex items-center justify-center space-x-1 shadow-kasavu transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.viewListingDetails}</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Quick District Selector Tray */}
        <div className="absolute bottom-4 left-4 z-20 max-w-sm sm:max-w-md hidden md:flex items-center space-x-1.5 overflow-x-auto p-2.5 rounded-2xl bg-[#FFFDF6]/95 border border-[#C6A15B]/40 shadow-nalukettu">
          <span className="text-[11px] font-bold text-[#405B43] uppercase px-2 font-serif flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-[#A64F32]" />
            <span>Districts:</span>
          </span>
          {districts.map((d) => (
            <button
              key={d.slug}
              onClick={() => handleSelectDistrict(d.slug)}
              className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition-all font-semibold ${
                selectedDistrict?.slug === d.slug
                  ? 'bg-[#405B43] text-white shadow-sm font-bold'
                  : 'text-[#392A20] hover:text-[#405B43] hover:bg-[#E8D8B8]/60'
              }`}
            >
              {language === 'ml' ? d.name_ml : d.name}
            </button>
          ))}
        </div>

        {/* Selected District Info Slide-out Drawer */}
        {selectedDistrict && isSidePanelOpen && (
          <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 z-30 bg-[#FFFDF6] border-l-2 border-[#C6A15B]/40 p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-[#E8D8B8] text-[#405B43] font-bold border border-[#C6A15B]/40">
                    {language === 'ml' ? 'തിരഞ്ഞെടുത്ത ജില്ല' : 'District Dossier'}
                  </span>
                  <h3 className="font-serif font-black text-2xl text-[#405B43] mt-1">
                    {language === 'ml' ? selectedDistrict.name_ml : selectedDistrict.name}
                  </h3>
                  <p className="text-xs text-[#392A20]/70 font-mono">
                    HQ: {selectedDistrict.headquarters} • Area: {selectedDistrict.area_sq_km} km²
                  </p>
                </div>
                <button
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-1 rounded-lg text-[#392A20]/60 hover:text-[#405B43] hover:bg-[#E8D8B8]"
                  aria-label="Close District Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedDistrict.hero_image && (
                <div className="relative rounded-2xl overflow-hidden border border-[#C6A15B]/30 shadow-sm">
                  <SafeImage
                    src={selectedDistrict.hero_image}
                    alt={selectedDistrict.name}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1 right-2 bg-black/60 px-2 py-0.5 rounded text-[9px] text-white/80">
                    {selectedDistrict.image_credit}
                  </div>
                </div>
              )}

              <p className="text-xs text-[#392A20]/80 leading-relaxed font-sans">
                {language === 'ml' ? selectedDistrict.description_ml : selectedDistrict.description_en}
              </p>

              {/* Verified Cultural Listings in District */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#405B43] flex items-center space-x-1.5 font-serif">
                  <Sparkles className="w-3.5 h-3.5 text-[#A64F32]" />
                  <span>
                    {language === 'ml' ? 'ജില്ലയിലെ കലകളും കേന്ദ്രങ്ങളും' : 'Documented Heritage In District'} ({filteredListings.length})
                  </span>
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {filteredListings.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onNavigate(`/cultural-listings/${item.id}`)}
                      className="p-2.5 rounded-xl bg-[#F7F0DF] border border-[#C6A15B]/30 hover:border-[#405B43] cursor-pointer transition-all flex items-center space-x-3 group shadow-sm"
                    >
                      {item.image && (
                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover border border-[#C6A15B]/30 flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-xs font-bold text-[#392A20] group-hover:text-[#405B43] truncate">
                          {language === 'ml' ? item.title_ml : item.title}
                        </h5>
                        <p className="text-[10px] text-[#392A20]/60 truncate">
                          {item.locality || selectedDistrict.name}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#A64F32] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  {filteredListings.length === 0 && (
                    <p className="text-xs text-[#392A20]/50 italic py-2">
                      No matching cultural records found for active filter.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button: Explore Full District Dossier */}
            <div className="pt-4 border-t border-[#C6A15B]/30 mt-4">
              <button
                onClick={() => onNavigate(`/districts/${selectedDistrict.slug}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#C6A15B] hover:bg-[#AB8742] text-[#123B32] font-serif font-bold text-xs uppercase tracking-wider shadow-kasavu flex items-center justify-center space-x-2 transition-all"
              >
                <span>{t.viewDistrictDetails}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
