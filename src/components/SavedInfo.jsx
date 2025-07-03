import { useEffect, useState } from "react";
import db from "../api/db";

export function SavedInfo() {
  const [region, setRegion] = useState(null);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const savedRegion = await db.region.get("selected");
      const savedPlants = await db.plants.toArray();
      setRegion(savedRegion);
      setPlants(savedPlants);
    }
    fetchData();
  }, []);

  return (
    <div className="savedInfo">
      <h3>✅ 저장된 정보</h3>
      {region ? (
        <div>
          <strong>지역:</strong> {region.do} {region.city}
        </div>
      ) : (
        <div>저장된 지역 없음</div>
      )}

      <div>
        <strong>식물 목록:</strong>
        {plants.length > 0 ? (
          <ul>
            {plants.map((p, idx) => (
              <li key={idx}>{p.name}</li>
            ))}
          </ul>
        ) : (
          <div>저장된 식물 없음</div>
        )}
      </div>
    </div>
  );
}