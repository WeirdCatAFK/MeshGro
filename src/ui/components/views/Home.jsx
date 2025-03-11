import "./Home.css";
function Home({ theme }) {
  return <content className={`view-container ${theme ? "dark" : "light"}`}>
    <p>
      Home
    </p>
  </content>;
}

export default Home;
