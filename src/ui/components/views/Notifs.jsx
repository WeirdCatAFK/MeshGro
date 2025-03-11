import "./Notifs.css";
function Notifs({ theme }) {
  return (
    <>
      <div className={`view-container ${theme ? "dark" : "light"}`}>
        <p>Notifs</p>
      </div>
    </>
  );
}

export default Notifs;
