import "./Map.css";
function Map({ theme }) {
  return (
    <>
      <div className={`view-container ${theme ? "dark" : "light"}`}>
        <p>Map</p>
      </div>
    </>
  );
}

export default Map;
