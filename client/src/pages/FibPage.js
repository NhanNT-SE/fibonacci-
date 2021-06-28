import React, { useEffect, useState } from "react";
import axios from "axios";
function FibPage() {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");
  const fetchValues = async () => {
    const response = await axios.get("/api/values/current");
    const data = response.data;
    setValues(data);
  };
  const fetchIndexes = async () => {
    const response = await axios.get("/api/values/all");
    const data = response.data;
    setSeenIndexes(data);
  };

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(", ");
  };
  const renderValues = () => {
    const entries = [];
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }
    return entries;
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/values", { index });
      setIndex("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Enter your index:</label>
        <input
          placeholder="Enter your index"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
        />
        <button>Submit</button>
        <h3>Indexes I have seen:</h3>
        {renderSeenIndexes()}
        <h3>Calculated Values:</h3>
        {renderValues()}
      </form>
    </div>
  );
}

export default FibPage;
