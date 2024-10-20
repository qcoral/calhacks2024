import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import "./App.css";
import * as d3 from "d3";
import LinePlot from "./components/LinePlot.jsx";
import StaticGraph from "./components/StaticGraph.jsx";

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://calhacks11backend.vercel.app/graph");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <h1>Alex's attempt to learn graph theory and make new connections</h1>
      <div>
        <StaticGraph data={data} />
      </div>
    </>
  );
}

export default App;