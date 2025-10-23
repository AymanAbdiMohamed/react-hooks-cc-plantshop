import React, { useState, useEffect } from "react";

function App() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");

  // Fetch all plants on load
  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then(res => res.json())
      .then(data => setPlants(data));
  }, []);

  // Add new plant
  const handleAddPlant = (e) => {
    e.preventDefault();
    const newPlant = { name, image, price: parseFloat(price) };

    fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPlant)
    })
      .then(res => res.json())
      .then(data => setPlants([...plants, data]));

    setName("");
    setImage("");
    setPrice("");
  };

  // Toggle sold out
  const toggleSoldOut = (id) => {
    setPlants(
      plants.map(p =>
        p.id === id ? { ...p, soldOut: !p.soldOut } : p
      )
    );
  };

  // Filter plants by search
  const filteredPlants = plants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Plantsy Admin</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search plants..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px", width: "200px" }}
      />

      {/* Add plant form */}
      <form onSubmit={handleAddPlant} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          step="0.01"
          required
        />
        <button type="submit">Add Plant</button>
      </form>

      {/* Plants list */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {filteredPlants.map(plant => (
          <div
            key={plant.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
              backgroundColor: plant.soldOut ? "#f8d7da" : "#fff"
            }}
          >
            <img
              src={plant.image}
              alt={plant.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h3>{plant.name}</h3>
            <p>${plant.price}</p>
            <button onClick={() => toggleSoldOut(plant.id)}>
              {plant.soldOut ? "Available" : "Sold Out"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
