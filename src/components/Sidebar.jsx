import React from "react";

function Sidebar({ lines, onSelectLine }) {
  return (
    <div className="sidebar">
      <h2>Transmission Lines</h2>

      <ul>
        {lines.map((line, idx) => (
          <li key={idx} onClick={() => onSelectLine(line)}>
            <strong>{line.properties.name}</strong>

            <div className="voltage">{line.properties.voltage} kV</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
