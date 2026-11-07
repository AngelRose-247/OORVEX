import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const PassportContext = createContext();

export const PassportProvider = ({ children }) => {
  const [visitedDistricts, setVisitedDistricts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('oorvex_visited_districts')) || [];
    } catch {
      return [];
    }
  });

  const [collectedStamps, setCollectedStamps] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('oorvex_collected_stamps')) || [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('oorvex_visited_districts', JSON.stringify(visitedDistricts));
  }, [visitedDistricts]);

  useEffect(() => {
    localStorage.setItem('oorvex_collected_stamps', JSON.stringify(collectedStamps));
  }, [collectedStamps]);

  const recordDistrictVisit = (districtSlug) => {
    if (!visitedDistricts.includes(districtSlug)) {
      setVisitedDistricts(prev => [...prev, districtSlug]);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#D6B46A', '#F3DC9B', '#102B24']
        });
      } catch (e) {
        // silent fallback if confetti disabled
      }
    }
  };

  const collectStamp = (stampId, stampTitle) => {
    if (!collectedStamps.some(s => s.id === stampId)) {
      const newStamp = {
        id: stampId,
        title: stampTitle,
        collectedAt: new Date().toLocaleDateString()
      };
      setCollectedStamps(prev => [...prev, newStamp]);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D6B46A', '#102B24', '#FFFFFF']
        });
      } catch (e) {}
    }
  };

  const totalDistricts = 14;
  const progressPercent = Math.min(100, Math.round((visitedDistricts.length / totalDistricts) * 100));

  return (
    <PassportContext.Provider
      value={{
        visitedDistricts,
        recordDistrictVisit,
        collectedStamps,
        collectStamp,
        progressPercent,
        totalDistricts,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </PassportContext.Provider>
  );
};

export const usePassport = () => useContext(PassportContext);
