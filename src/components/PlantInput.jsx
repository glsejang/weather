import { useState } from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


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
      <InputGroup  size="sm" className="mb-3">
        
        <Form.Control
        value={plantName}
        onChange={handleChange}
        placeholder="식물 이름"
        required
      />
        <Button variant="outline-secondary" id="button-addon1" type="submit">
            입력
        </Button>
      </InputGroup>



      
      {/* <button type="submit">입력</button> */}
    </form>
    



  );
}

export default PlantInput;
