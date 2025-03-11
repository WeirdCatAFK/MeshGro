import "./Data.css";
function Data({ theme }) {
  return (
    <>
      <div className={`view-container ${theme ? "dark" : "light"}`}>
        <p>Data</p>
      </div>
    </>
  );
}

export default Data;
