import { useEffect, useState } from 'react'
import { regionData } from '../data/regionData.js';


function RegionSelector({ selectedDo, setSelectedDo, selectedCity, setSelectedCity }) {
  const doList = Object.keys(regionData);
  const cityList = selectedDo ? regionData[selectedDo] : [];

  const onDoChange = (e) => {
    setSelectedDo(e.target.value);
    setSelectedCity('');
  };

  const onCityChange = (e) => {
      console.log('선택한 도시:', e.target.value);  // 여기서 선택된 값 확인 가능

    setSelectedCity(e.target.value);
  };

  return (
    <div className='region' style={{ fontFamily: 'Arial, sans-serif', maxWidth: 400 }}>
      <h4>도-시(구) 선택</h4>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="select-do" style={{ marginRight: 8 }}>
          도/광역시:
        </label>
        <select id="select-do" value={selectedDo} onChange={onDoChange}>
          <option value="">-- 선택하세요 --</option>
          {doList.map((doName) => (
            <option key={doName} value={doName}>
              {doName}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="select-city" style={{ marginRight: 8 }}>
          시/구/군:
        </label>
        <select
          id="select-city"
          value={selectedCity}
          onChange={onCityChange}
          disabled={!selectedDo}
        >
          <option value="">-- 선택하세요 --</option>
          {cityList.map((cityName) => (
            <option key={cityName} value={cityName}>
              {cityName}
            </option>
          ))}
        </select>
      </div>

      {selectedDo && selectedCity && (
        <p>
          선택한 지역: <b>{selectedDo}</b> - <b>{selectedCity}</b>
        </p>
      )}
    </div>
  );
}

export default RegionSelector;