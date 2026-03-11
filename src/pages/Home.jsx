// import { useEffect, useState } from "react";
// import MapView from "../components/MapView";

// export default function Home() {
//   const [geo, setGeo] = useState(null);

//   const [ndvipoint, setndvipoint] = useState(null);

//   useEffect(() => {
//     fetch("/power_lines.geojson")
//       // fetch("/ndvi_points.geojson")
//       .then((res) => res.json())
//       .then((data) => setGeo(data));
//   }, []);

//   if (!geo) return <p>Loading...</p>;

//   useEffect(() => {
//     // fetch("/power_lines.geojson")
//     fetch("/ndvi_points.geojson")
//       .then((res) => res.json())
//       .then((data) => setndvipoint(data));
//   }, []);

//   if (!ndvipoint) return <p>Loading NDVI Points...</p>;

//   return <MapView lines={geo} />;
// }
