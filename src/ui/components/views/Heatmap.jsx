import "./Heatmap.css";
function Heatmap({ theme }) {
  return (
    <>
      <div className={`view-container ${theme ? "dark" : "light"}`}>
        <p>Heatmap</p>
      </div>
    </>
  );
}

export default Heatmap;
