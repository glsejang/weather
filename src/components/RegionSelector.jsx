import { useState } from 'react';
import { regionData } from '../data/regionData.js';
import Form from 'react-bootstrap/Form';

function RegionSelector({ selectedDo, setSelectedDo, selectedCity, setSelectedCity }) {
  const doList = Object.keys(regionData);

  const isMetropolitan = (doName) =>
    ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종'].includes(doName);

  const onDoChange = (e) => {
    const selected = e.target.value;
    setSelectedDo(selected);
    if (isMetropolitan(selected)) {
      setSelectedCity(''); // 광역시면 시 선택 필요 없음
    }
  };

  const onCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const cityList = regionData[selectedDo] || [];

  return (
    <div className="region" style={{ fontFamily: 'Arial', maxWidth: 400 }}>
      <h4>지역 선택</h4>

      {/* 도/광역시 선택 */}
      <Form.Group style={{ marginBottom: 12 }}>
        <Form.Label>도 / 광역시</Form.Label>
        <Form.Select value={selectedDo} onChange={onDoChange}>
          <option value="">-- 선택하세요 --</option>
          {doList.map((doName) => (
            <option key={doName} value={doName}>
              {doName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* 시/군 선택 (도만 해당) */}
      {!isMetropolitan(selectedDo) && cityList.length > 0 && (
        <Form.Group style={{ marginBottom: 12 }}>
          <Form.Label>시 / 군</Form.Label>
          <Form.Select value={selectedCity} onChange={onCityChange}>
            <option value="">-- 선택하세요 --</option>
            {cityList.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {/* 결과 표시 */}
      <p>
        선택한 지역:{' '}
        <strong>
          {selectedDo}
          {!isMetropolitan(selectedDo) && selectedCity ? ` ${selectedCity}` : ''}
        </strong>
      </p>
    </div>
  );
}

export default RegionSelector;