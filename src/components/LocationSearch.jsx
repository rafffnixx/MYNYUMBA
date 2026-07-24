import React, { useState, useEffect, useRef } from 'react';
import { useLocationSearch } from '../hooks/useKenyaLocations';

function LocationSearch({ onSelect, placeholder = 'Search for a location in Kenya...' }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { results, isLoading, error } = useLocationSearch(query, { 
    limit: 15,
    debounceMs: 300
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 1) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (result) => {
    const item = result.item;
    setQuery(item.name);
    setIsOpen(false);
    onSelect?.({
      type: result.type,
      name: item.name,
      county: item.county || '',
      town: item.town || item.locality || '',
      street: item.name,
      data: item
    });
  };

  const getResultLabel = (result) => {
    const item = result.item;
    const typeLabels = {
      county: 'County',
      constituency: 'Constituency',
      ward: 'Ward',
      locality: 'Locality',
      area: 'Area'
    };
    const typeLabel = typeLabels[result.type] || result.type;
    return `${item.name} (${typeLabel})`;
  };

  const getResultSubtitle = (result) => {
    const item = result.item;
    if (result.type === 'county' && item.capital) {
      return `Capital: ${item.capital}`;
    }
    if (item.county) {
      return item.county;
    }
    if (item.locality) {
      return `Locality: ${item.locality}`;
    }
    return '';
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          <i className="fas fa-search"></i>
        </div>
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <i className="fas fa-spinner fa-spin text-blue-500"></i>
          </div>
        )}
      </div>
      
      {isOpen && query.length > 1 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {error ? (
            <div className="p-4 text-center text-red-500">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          ) : isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No locations found for "{query}"
            </div>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                onClick={() => handleSelect(result)}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">
                    {getResultLabel(result)}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">
                    {result.type}
                  </span>
                </div>
                {getResultSubtitle(result) && (
                  <div className="text-xs text-gray-500">
                    {getResultSubtitle(result)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default LocationSearch;