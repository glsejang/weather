import { useEffect, useState } from 'react'




function PlantInput({ addPlant }) {
  const [plant, setPlant] = useState({ name: "", water: "", light: "" });

  const handleChange = (e) => {
    setPlant({ ...plant, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plant.name || !plant.water || !plant.light) {
      alert("모든 항목을 입력하세요.");
      return;
    }
    addPlant(plant); // 부모에 데이터 전달
    setPlant({ name: "", water: "", light: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={plant.name} onChange={handleChange} placeholder="식물 이름" required />
      <input name="water" value={plant.water} onChange={handleChange} placeholder="물 주는 주기" required />
      <input name="light" value={plant.light} onChange={handleChange} placeholder="햇빛 조건" required />
      <button type="submit">입력</button>
    </form>
  );
}

export default PlantInput;