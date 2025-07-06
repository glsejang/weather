import React, { useState } from "react";
import db from "../api/db";

export function SavedInfo({ plants, region }) {
  const [message, setMessage] = useState(null);

  async function clearAllData() {
    try {
      await db.region.clear();
      await db.plants.clear();
      await db.todos.clear();
      await db.forecast.clear();
      setMessage("✅ 모든 데이터가 초기화되었습니다.");
    } catch (err) {
      console.error("초기화 실패:", err);
      setMessage("❌ 초기화 중 오류 발생");
    }

    setTimeout(() => setMessage(null), 2000);
  }

  return (
    <div className="saved">
      <div className="savedInfo">
        <h4 style={{ fontSize: "1rem" }}>✅ 저장된 정보</h4>
        {region?.do && region?.city ? (
          <div><strong>지역:</strong> {region.do} {region.city}</div>
        ) : (
          "저장된 지역 없음"
        )}

        <button
          onClick={clearAllData}
          style={{
            marginTop: '1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px'
          }}
        >
          모든 데이터 초기화
        </button>

        {message && (
          <div
            style={{
              marginTop: "1rem",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
            }}>
            {message}
          </div>
        )}
      </div>

      <div>
        <strong>식물 목록:</strong>
        {plants.length > 0 ? (
          <ul>
            {plants.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        ) : (
          <div>저장된 식물 없음</div>
        )}
      </div>
    </div>
  );
}