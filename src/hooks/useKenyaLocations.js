import { useState, useEffect, useMemo } from 'react';
import {
  getCounties,
  getCountyByName,
  getCountyByCode,
  getConstituenciesInCounty,
  getWardsInCounty,
  getWardsInConstituency,
  getLocalitiesInCounty,
  getAreasInLocality,
  getAreasInCounty,
  search
} from 'kenya-locations';

// Hook to get all counties
export const useCounties = () => {
  return useMemo(() => getCounties(), []);
};

// Hook to get a single county by name
export const useCounty = (name) => {
  return useMemo(() => {
    if (!name) return null;
    return getCountyByName(name);
  }, [name]);
};

// Hook to get constituencies in a county
export const useConstituenciesInCounty = (countyName) => {
  return useMemo(() => {
    if (!countyName) return [];
    try {
      return getConstituenciesInCounty(countyName);
    } catch {
      return [];
    }
  }, [countyName]);
};

// Hook to get wards in a county
export const useWardsInCounty = (countyName) => {
  return useMemo(() => {
    if (!countyName) return [];
    try {
      return getWardsInCounty(countyName);
    } catch {
      return [];
    }
  }, [countyName]);
};

// Hook to get wards in a constituency
export const useWardsInConstituency = (constituencyName) => {
  return useMemo(() => {
    if (!constituencyName) return [];
    try {
      return getWardsInConstituency(constituencyName);
    } catch {
      return [];
    }
  }, [constituencyName]);
};

// Hook to get localities in a county
export const useLocalitiesInCounty = (countyName) => {
  return useMemo(() => {
    if (!countyName) return [];
    try {
      return getLocalitiesInCounty(countyName);
    } catch {
      return [];
    }
  }, [countyName]);
};

// Hook to get areas in a locality
export const useAreasInLocality = (localityName) => {
  return useMemo(() => {
    if (!localityName) return [];
    try {
      return getAreasInLocality(localityName);
    } catch {
      return [];
    }
  }, [localityName]);
};

// Hook for search with debounce
export const useLocationSearch = (query, options = {}) => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        const searchResults = search(query, {
          limit: options.limit || 10,
          types: options.types || undefined,
        });
        setResults(searchResults || []);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, options.debounceMs || 300);

    return () => clearTimeout(timer);
  }, [query, options.limit, options.types, options.debounceMs]);

  return { results, isLoading, error };
};

// Hook to get county options for dropdown
export const useCountyOptions = () => {
  const counties = useCounties();
  return useMemo(() => {
    return counties.map(county => ({
      value: county.name,
      label: `${county.name}${county.capital ? ` (${county.capital})` : ''}`,
      data: county
    }));
  }, [counties]);
};

// Hook to get town/area options based on county
export const useLocationOptions = (countyName) => {
  const constituencies = useConstituenciesInCounty(countyName);
  const localities = useLocalitiesInCounty(countyName);
  
  return useMemo(() => {
    const options = [];
    
    // Add constituencies as options
    constituencies.forEach(c => {
      options.push({
        value: c.name,
        label: `${c.name} (Constituency)`,
        type: 'constituency',
        data: c
      });
    });
    
    // Add localities as options
    localities.forEach(l => {
      options.push({
        value: l.name,
        label: `${l.name} (Locality)`,
        type: 'locality',
        data: l
      });
    });
    
    return options;
  }, [constituencies, localities]);
};

export default {
  useCounties,
  useCounty,
  useConstituenciesInCounty,
  useWardsInCounty,
  useWardsInConstituency,
  useLocalitiesInCounty,
  useAreasInLocality,
  useLocationSearch,
  useCountyOptions,
  useLocationOptions
};