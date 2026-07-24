import React, { useState, useEffect } from 'react';
import { useCountyOptions, useLocationOptions } from '../hooks/useKenyaLocations';

function LocationSelect({ onLocationChange, initialCounty, initialTown, initialStreet }) {
  const countyOptions = useCountyOptions();
  const [selectedCounty, setSelectedCounty] = useState(initialCounty || '');
  const [selectedTown, setSelectedTown] = useState(initialTown || '');
  const [selectedStreet, setSelectedStreet] = useState(initialStreet || '');
  
  // Get location options based on selected county
  const locationOptions = useLocationOptions(selectedCounty);
  
  // Get street options (we'll use location options for streets too)
  const streetOptions = selectedTown ? 
    locationOptions.filter(opt => opt.label.includes(selectedTown)) : 
    [];

  const handleCountyChange = (e) => {
    const value = e.target.value;
    setSelectedCounty(value);
    setSelectedTown('');
    setSelectedStreet('');
    onLocationChange?.({ county: value, town: '', street: '' });
  };

  const handleTownChange = (e) => {
    const value = e.target.value;
    setSelectedTown(value);
    setSelectedStreet('');
    onLocationChange?.({ county: selectedCounty, town: value, street: '' });
  };

  const handleStreetChange = (e) => {
    const value = e.target.value;
    setSelectedStreet(value);
    onLocationChange?.({ county: selectedCounty, town: selectedTown, street: value });
  };

  return (
    <div className="space-y-3">
      {/* County Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          County *
        </label>
        <select
          value={selectedCounty}
          onChange={handleCountyChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select County</option>
          {countyOptions.map((county) => (
            <option key={county.value} value={county.value}>
              {county.label}
            </option>
          ))}
        </select>
      </div>

      {/* Town/Area Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Town / Area *
        </label>
        <select
          value={selectedTown}
          onChange={handleTownChange}
          disabled={!selectedCounty}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          required
        >
          <option value="">Select Town / Area</option>
          {locationOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Street/Area Detail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street / Area Detail
        </label>
        <input
          type="text"
          value={selectedStreet}
          onChange={handleStreetChange}
          placeholder="Enter street or specific area name"
          disabled={!selectedTown}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <p className="text-xs text-gray-400 mt-1">
          You can type any street or area name here
        </p>
      </div>
    </div>
  );
}

export default LocationSelect;