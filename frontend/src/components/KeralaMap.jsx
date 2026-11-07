import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '../context/LanguageContext';
import { usePassport } from '../context/PassportContext';
import keralaGeoJson from '../assets/kerala_districts.json';
import {
  Search, Filter, MapPin, Eye, Compass, Layers, ExternalLink,
  Sparkles, CheckCircle2, ChevronRight, X
} from 'lucide-react';

// Custom antique gold marker icon for cultural locations
const createCulturalIcon = (isFeatured = false) => {
  return L.divIcon({
    className: 'custom-cultural-pin',
    html: `
      <div style="
        width: ${isFeatured ? '36px' : '30px'};
        height: ${isFeatured ? '36px' : '30px'};
        background: ${isFeatured ? 'radial-gradient(circle, #F3DC9B 0%, #D6B46A 60%, #102B24 100%)' : '#102B24'};
        border: 2px solid ${isFeatured ? '#FFFFFF' : '#D6B46A'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #F4EBD9;
        font-size: ${isFeatured ? '16px' : '13px'};
        box-shadow: 0 0 15px rgba(214, 180, 106, 0.7);
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

// Component to handle programmatic map flying/panning
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
  const [mapCenter, setMapCenter] = useState([10.4, 76.4]); // Center of Kerala
  const [mapZoom, setMapZoom] = useState(7);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // Filter listings based on active filters
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

  // Handle clicking a district feature on GeoJSON
  const onEachDistrict = (feature, layer) => {
    const { slug, name, name_ml, center } = feature.properties;

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({
          weight: 3,
          color: '#F3DC9B',
          fillColor: '#D6B46A',
          fillOpacity: 0.35,
        });
      },
      mouseout: (e) => {
        const target = e.target;
        const isCurrent = selectedDistrict && selectedDistrict.slug === slug;
        target.setStyle({
          weight: isCurrent ? 3 : 1.5,
          color: isCurrent ? '#F3DC9B' : '#D6B46A',
          fillColor: isCurrent ? '#D6B46A' : '#102B24',
          fillOpacity: isCurrent ? 0.45 : 0.2,
        });
      },
      click: () => {
        handleSelectDistrict(slug);
      }
    });

    layer.bindTooltip(
      `<strong>${language === 'ml' ? name_ml : name}</strong>`,
      { permanent: false, direction: 'center', className: 'glass-panel text-xs text-heritage-gold font-bold px-2 py-1' }
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
    <div className="relative w-full h-[780px] rounded-2xl overflow-hidden border border-heritage-gold/30 shadow-emerald-deep bg-heritage-dark flex flex-col">
      
      {/* Top Filter and Search Bar */}
      <div className="z-20 w-full glass-panel-dark px-4 py-3 border-b border-heritage-gold/25 flex flex-wrap items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-heritage-gold absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-heritage-forest/60 border border-heritage-gold/30 text-heritage-ivory placeholder-heritage-ivory/50 focus:border-heritage-gold focus:outline-none"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              !selectedCategory
                ? 'bg-heritage-gold text-heritage-dark font-bold shadow-gold-subtle'
                : 'bg-heritage-forest/60 text-heritage-ivory/80 border border-heritage-gold/30 hover:border-heritage-gold'
            }`}
          >
            {t.allCategories}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === c.slug
                  ? 'bg-heritage-gold text-heritage-dark font-bold shadow-gold-subtle'
                  : 'bg-heritage-forest/60 text-heritage-ivory/80 border border-heritage-gold/30 hover:border-heritage-gold'
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
            className="px-2.5 py-1.5 rounded-lg bg-heritage-terracotta/30 border border-heritage-terracotta/60 text-heritage-ivory text-xs flex items-center space-x-1 hover:bg-heritage-terracotta/50"
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

          {/* OpenStreetMap Base Tile Layer with Dark Attribution */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | OORVEX Heritage Map'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Kerala 14 Districts GeoJSON Boundary Polygons */}
          <GeoJSON
            data={keralaGeoJson}
            onEachFeature={onEachDistrict}
            style={(feature) => {
              const isSelected = selectedDistrict && selectedDistrict.slug === feature.properties.slug;
              return {
                fillColor: isSelected ? '#D6B46A' : '#102B24',
                weight: isSelected ? 3 : 1.5,
                opacity: 0.9,
                color: isSelected ? '#F3DC9B' : '#D6B46A',
                fillOpacity: isSelected ? 0.45 : 0.2,
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
                  <div className="p-2 space-y-2 max-w-[260px]">
                    {listing.image && (
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-28 object-cover rounded-lg border border-heritage-gold/30"
                        loading="lazy"
                      />
                    )}
                    <div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/40">
                        {listing.category?.name_en || 'Heritage'}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-heritage-gold pt-1">
                        {language === 'ml' ? listing.title_ml : listing.title}
                      </h4>
                      <p className="text-xs text-heritage-ivory/80 flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-heritage-gold inline" />
                        <span>{listing.locality || 'Kerala'}</span>
                      </p>
                    </div>

                    <p className="text-[11px] text-heritage-ivory/70 line-clamp-2">
                      {language === 'ml' ? listing.description_ml : listing.description_en}
                    </p>

                    <button
                      onClick={() => onNavigate(`/cultural-listings/${listing.id}`)}
                      className="w-full py-1.5 px-3 rounded-lg bg-heritage-gold text-heritage-dark font-bold text-xs flex items-center justify-center space-x-1 hover:brightness-110"
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
        <div className="absolute bottom-4 left-4 z-20 max-w-sm sm:max-w-md hidden md:flex items-center space-x-1.5 overflow-x-auto p-2 rounded-xl glass-panel-dark border border-heritage-gold/30">
          <span className="text-[11px] font-bold text-heritage-gold uppercase px-2 font-mono flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5 text-heritage-gold" />
            <span>Districts:</span>
          </span>
          {districts.map((d) => (
            <button
              key={d.slug}
              onClick={() => handleSelectDistrict(d.slug)}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-all ${
                selectedDistrict?.slug === d.slug
                  ? 'bg-heritage-gold text-heritage-dark font-bold'
                  : 'text-heritage-ivory/80 hover:text-heritage-gold hover:bg-heritage-forest/80'
              }`}
            >
              {language === 'ml' ? d.name_ml : d.name}
            </button>
          ))}
        </div>

        {/* Selected District Info Slide-out Drawer */}
        {selectedDistrict && isSidePanelOpen && (
          <div className="absolute top-0 right-0 bottom-0 w-full sm:w-96 z-30 glass-panel-dark border-l border-heritage-gold/30 p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-heritage-gold/20 text-heritage-gold border border-heritage-gold/30">
                    {language === 'ml' ? 'തിരഞ്ഞെടുത്ത ജില്ല' : 'District Dossier'}
                  </span>
                  <h3 className="font-serif font-black text-2xl text-heritage-gold mt-1">
                    {language === 'ml' ? selectedDistrict.name_ml : selectedDistrict.name}
                  </h3>
                  <p className="text-xs text-heritage-ivory/60 font-mono">
                    HQ: {selectedDistrict.headquarters} • Area: {selectedDistrict.area_sq_km} km²
                  </p>
                </div>
                <button
                  onClick={() => setIsSidePanelOpen(false)}
                  className="p-1 rounded-lg text-heritage-ivory/70 hover:text-heritage-gold hover:bg-heritage-forest"
                  aria-label="Close District Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedDistrict.hero_image && (
                <div className="relative rounded-xl overflow-hidden border border-heritage-gold/30 shadow-md">
                  <img
                    src={selectedDistrict.hero_image}
                    alt={selectedDistrict.name}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1 right-2 bg-black/70 px-2 py-0.5 rounded text-[9px] text-white/70">
                    {selectedDistrict.image_credit}
                  </div>
                </div>
              )}

              <p className="text-xs text-heritage-ivory/80 leading-relaxed">
                {language === 'ml' ? selectedDistrict.description_ml : selectedDistrict.description_en}
              </p>

              {/* Verified Cultural Listings within this district */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-heritage-gold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {language === 'ml' ? 'ജില്ലയിലെ കലകളും കേന്ദ്രങ്ങളും' : 'Documented Heritage In District'} ({filteredListings.length})
                  </span>
                </h4>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {filteredListings.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onNavigate(`/cultural-listings/${item.id}`)}
                      className="p-2.5 rounded-lg bg-heritage-forest/60 border border-heritage-gold/20 hover:border-heritage-gold cursor-pointer transition-all flex items-center space-x-3 group"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover border border-heritage-gold/20 flex-shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-serif text-xs font-bold text-heritage-ivory group-hover:text-heritage-gold truncate">
                          {language === 'ml' ? item.title_ml : item.title}
                        </h5>
                        <p className="text-[10px] text-heritage-ivory/60 truncate">
                          {item.locality || selectedDistrict.name}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-heritage-gold/60 group-hover:text-heritage-gold group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                  {filteredListings.length === 0 && (
                    <p className="text-xs text-heritage-ivory/50 italic py-2">
                      No matching cultural records found for active filter.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-heritage-gold/20 mt-4">
              <button
                onClick={() => onNavigate(`/districts/${selectedDistrict.slug}`)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-heritage-gold to-heritage-goldDark text-heritage-dark font-bold text-xs uppercase tracking-wider shadow-gold-subtle hover:brightness-110 flex items-center justify-center space-x-2"
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
