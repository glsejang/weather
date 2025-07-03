import { useState } from "react";


function PlantInput({ addPlant }) {
  const [plantName, setPlantName] = useState("");

  const handleChange = (e) => {
    setPlantName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plantName.trim()) {
      alert("식물 이름을 입력하세요.");
      return;
    }
    addPlant(plantName); // 문자열로 전달
    setPlantName(""); // 초기화
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={plantName}
        onChange={handleChange}
        placeholder="식물 이름"
        required
      />
      <button type="submit">입력</button>
    </form>
  );
}

export default PlantInput;
