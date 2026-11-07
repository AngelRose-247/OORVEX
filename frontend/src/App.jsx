import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { PassportProvider } from './context/PassportContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import KeralaMap from './components/KeralaMap';
import CultureMatchModal from './components/CultureMatchModal';
import AccessibilityBar from './components/AccessibilityBar';
import PassportDrawer from './components/PassportDrawer';

import Home from './pages/Home';
import ExploreDistricts from './pages/ExploreDistricts';
import DistrictDetail from './pages/DistrictDetail';
import CulturalListings from './pages/CulturalListings';
import CulturalDetail from './pages/CulturalDetail';
import CraftsGallery from './pages/CraftsGallery';
import CulturalStories from './pages/CulturalStories';
import GlossaryPage from './pages/GlossaryPage';
import ContributePage from './pages/ContributePage';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';

import { fetchDistricts, fetchCategories, fetchListings } from './services/api';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash ? window.location.hash.replace('#', '') : '/';
      setCurrentPath(path);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // Initial fetch from backend with fallback
  useEffect(() => {
    let isMounted = true;
    const initData = async () => {
      try {
        const [dData, cData, lData] = await Promise.all([
          fetchDistricts(),
          fetchCategories(),
          fetchListings()
        ]);
        if (isMounted) {
          setDistricts(dData || []);
          setCategories(cData || []);
          setListings(lData || []);
          setDataLoaded(true);
        }
      } catch (err) {
        if (isMounted) setDataLoaded(true);
      }
    };
    initData();
    return () => { isMounted = false; };
  }, []);

  // Simple route parser
  const renderCurrentPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return (
        <Home
          districts={districts}
          listings={listings}
          categories={categories}
          onNavigate={navigate}
          onOpenAI={() => setIsAIModalOpen(true)}
        />
      );
    }

    if (currentPath === '/map') {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          <div>
            <span className="text-xs uppercase font-serif tracking-widest text-heritage-terracotta font-bold">
              Geographic Cultural Discovery
            </span>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-heritage-maroon mt-1">
              Interactive Kerala Culture Map
            </h1>
            <p className="text-sm text-heritage-timber/80 max-w-2xl mt-2 leading-relaxed">
              Explore all 14 district boundaries, cultural clusters, and authentic regional heritage records.
            </p>
          </div>
          <div className="w-full">
            <KeralaMap
              districts={districts}
              listings={listings}
              categories={categories}
              onNavigate={navigate}
            />
          </div>
        </div>
      );
    }

    if (currentPath === '/districts') {
      return <ExploreDistricts districts={districts} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/districts/')) {
      const slug = currentPath.replace('/districts/', '');
      return (
        <DistrictDetail
          districtSlug={slug}
          districts={districts}
          listings={listings}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/listings') {
      return (
        <CulturalListings
          listings={listings}
          categories={categories}
          districts={districts}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath.startsWith('/cultural-listings/')) {
      const id = currentPath.replace('/cultural-listings/', '');
      return (
        <CulturalDetail
          listingId={id}
          allListings={listings}
          onNavigate={navigate}
        />
      );
    }

    if (currentPath === '/crafts') {
      return <CraftsGallery listings={listings} onNavigate={navigate} />;
    }

    if (currentPath === '/stories') {
      return <CulturalStories listings={listings} onNavigate={navigate} />;
    }

    if (currentPath === '/glossary') {
      return <GlossaryPage onNavigate={navigate} />;
    }

    if (currentPath === '/contribute') {
      return (
        <ContributePage
          districts={districts}
          categories={categories}
        />
      );
    }

    if (currentPath === '/admin') {
      return <AdminDashboard onNavigate={navigate} listings={listings} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    // Default fallback to Home
    return (
      <Home
        districts={districts}
        listings={listings}
        categories={categories}
        onNavigate={navigate}
        onOpenAI={() => setIsAIModalOpen(true)}
      />
    );
  };

  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <PassportProvider>
          <div className="flex flex-col min-h-screen bg-heritage-ivory text-heritage-timber selection:bg-heritage-terracotta selection:text-heritage-ivory font-sans">
            
            {/* Top Navigation */}
            <Navbar
              currentPath={currentPath}
              onNavigate={navigate}
              onOpenAI={() => setIsAIModalOpen(true)}
              onOpenAccessibility={() => setIsAccessibilityOpen(true)}
            />

            {/* Main Page Body */}
            <main className="flex-1 w-full">
              {renderCurrentPage()}
            </main>

            {/* Cultural Footer */}
            <Footer onNavigate={navigate} />

            {/* CultureMatch AI Assistant Dialog */}
            <CultureMatchModal
              isOpen={isAIModalOpen}
              onClose={() => setIsAIModalOpen(false)}
              onNavigate={navigate}
            />

            {/* Accessibility Settings Drawer */}
            <AccessibilityBar
              isOpen={isAccessibilityOpen}
              onClose={() => setIsAccessibilityOpen(false)}
            />

            {/* Cultural Passport Drawer */}
            <PassportDrawer onNavigate={navigate} />

          </div>
        </PassportProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}
