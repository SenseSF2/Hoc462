import React from "react";
import styles from "./Drawer.css";
const Drawer = ({ selectedTab, select, children: tabs, locked }) => (
  <div className={styles.drawer}>
    <div className="tabs">
      {(locked ? [tabs.find(({ id }) => selectedTab === id)] : tabs).map(
        ({ name, id, hidden }) =>
          (selectedTab === id || !hidden) && (
            <button
              className="tab"
              disabled={selectedTab === id}
              onClick={() => select(id)}
              key={id.toString()}
            >
              {name}
            </button>
          )
      )}
    </div>
    <div className="content">
      {tabs.find(({ id }) => id === selectedTab).component}
    </div>
  </div>
);
export default Drawer;
