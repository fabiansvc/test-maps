import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Papa from "papaparse";
import "./App.css";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterType, setFilterType] = useState("Asesinato");

  useEffect(() => {
    fetch("/data.csv")
      .then((response) => response.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            setData(results.data); 
            setFilteredData(
              data.filter((incident) => incident.tipo === filterType)
            );
          },
        });
      })
      .catch((error) => console.error("Error cargando el archivo CSV:", error));
  }, [filterType, data]);

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const mapContainerStyle = { width: "100vw", height: "100vh" };
  const center = { lat: 4.60971, lng: -74.08175 };

  return (
    <div>
      <div className="filter-container">
        <label>Selecciona tipo de incidente: </label>
        <select value={filterType} onChange={handleFilterChange}>
          <option value="Asesinato">Asesinato</option>
          <option value="Hurto">Hurto</option>
        </select>
      </div>
      <LoadScript googleMapsApiKey="AIzaSyAKJWf241BjKNAEdLgsFVAelNFyWXGdThk">
        <GoogleMap mapContainerStyle={mapContainerStyle} zoom={10} center={center}>
          {filteredData.map((incident, index) => (
            <Marker
              key={index}
              position={{
                lat: parseFloat(incident.lat),
                lng: parseFloat(incident.lng),
              }}
              icon={{
                url: incident.tipo === "Asesinato" ? "/asesinato.png" : "/hurto.png",
                scaledSize: new window.google.maps.Size(64, 64),
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default App;
