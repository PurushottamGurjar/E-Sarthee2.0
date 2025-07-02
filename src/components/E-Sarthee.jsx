import React, { useEffect, useRef, useState } from "react";
import "./esarthee.css";
import { io } from "socket.io-client";
import { sartheeIcons } from "../assets/myassets";

const socket = io("https://e-sarthee.onrender.com");

const ESarthee = () => {
  const [color, setcolor] = useState("#007BFF"); //green #008000 //blue #007BFF //amother green #0500ff
  const [isMenu, setIsMenu] = useState(false);
  const map = useRef(null);
  const markerRef = useRef(null);
  const marker1Ref = useRef(null);

  useEffect(() => {
    map.current = L.map("map").setView([27.48, 76.86], 15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 20,
      attribution: "&copy; OpenStreetMap | Purushottam Gurjar",
    }).addTo(map.current);

    socket.on("fetch-all-locations", (data) => {
      const { latitude, longitude } = data;

      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        console.log("new location got");
      } else {
        markerRef.current = L.marker([latitude, longitude], {
          title: "Van Location",
        })
          .addTo(map.current)
          .bindPopup("Van Live Location")
          .openPopup();
      }
    });

    return () => {
      map.current.remove();
    };
  }, []);

  return (
    <div>
      <div className="sarthee-heading">
        <div className="sarthee-heading-first" style={{ color: color }}>
          E-Sarthee
        </div>
        <div className="sarthee-heading-second">
          <div
            className="nav-about  each-nav-item"
            onClick={() =>
              window.open("https://purushottam-gurjar.vercel.app", "_self")
            }
          >
            &lt;About Developer&gt;
          </div>
          <div
            className="nav-connect each-nav-item"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/purushottam-gurjar/",
                "_self"
              )
            }
          >
            Connect
          </div>
          <div
            className="nav-connect each-nav-item"
            onClick={() =>
              window.open(
                "https://github.com/PurushottamGurjar/E-Sarthee2.0",
                "_self"
              )
            }
          >
            Contribute
          </div>
          <div
            className="nav-contact each-nav-item"
            onClick={() =>
              window.open(
                "https://contact-purushottam-gurjar.vercel.app",
                "_self"
              )
            }
          >
            Contact
          </div>

          <div className="nav-install each-nav-item">Install App</div>
        </div>
        <div className="sarthee-menu">
          {/* {!isMenu && <img  className="sarthee-menu-icon" src={sartheeIcons.menu_icon2} alt="Menu" onClick={()=>setIsMenu(true)}/>}
            {isMenu && <img  className="sarthee-menu-icon" src={sartheeIcons.cross_icon} alt="cross" onClick={()=>setIsMenu(false)} />} */}
          {!isMenu && (
            <div>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setIsMenu(!isMenu)}
              >
                <rect x="3" y="6" width="20" height="2.5" rx="1" fill={color} />
                <rect x="3" y="12" width="20" height="2.5" rx="1" fill={color} />
                <rect x="3" y="18" width="20" height="2.5" rx="1" fill={color} />
              </svg>
            </div>
          )}
          {isMenu && (
            <div>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={()=>setIsMenu(!isMenu)}
              >
                <rect x="2" y="11" width="20" height="2.5" rx="1" fill="#007BFF" transform="rotate(45 12 12)" />
                <rect x="2" y="11" width="20" height="2.5" rx="1" fill="#007BFF" transform="rotate(-45 12 12)" />
                
              </svg>
            </div>
          )}
        </div>
      </div>
      <div id="map"></div>

      {isMenu && (
        <div className="sarthee-menu-content">
          <div
            className="sarthee-menu-each-item"
            onClick={() =>
              window.open("https://purushottam-gurjar.vercel.app", "_self")
            }
          >
            <div className="">About Developer</div>
            <img src={sartheeIcons.rightarrow_icon} alt="open" />
          </div>

          <div
            className="sarthee-menu-each-item"
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/purushottam-gurjar/",
                "_self"
              )
            }
          >
            <div className="">Connect on LinkedIn</div>
            <img src={sartheeIcons.rightarrow_icon} alt="open" />
          </div>

          <div
            className="sarthee-menu-each-item"
            onClick={() =>
              window.open(
                "https://github.com/PurushottamGurjar/E-Sarthee2.0",
                "_self"
              )
            }
          >
            <div className="">Contribute - Github</div>
            <img src={sartheeIcons.rightarrow_icon} alt="open" />
          </div>

          <div
            className="sarthee-menu-each-item"
            onClick={() =>
              window.open(
                "https://contact-purushottam-gurjar.vercel.app",
                "_self"
              )
            }
          >
            <div className="">Contact</div>
            <img src={sartheeIcons.rightarrow_icon} alt="open" />
          </div>

          <div className="sarthee-menu-each-item">
            <div className="">Share Feeback</div>
            <img src={sartheeIcons.rightarrow_icon} alt="open" />
          </div>

          <div
            className="sarthee-menu-install"
            onClick={() =>
              window.open(
                "https://drive.google.com/file/d/1lSNbT9ABIMsVvzVEMcvJyil7_FJzCp4A/view?usp=sharing",
                "_self"
              )
            }
            style={{ backgroundColor: color }}
          >
            <img
              src={sartheeIcons.ESarthee_Logo}
              alt="E-Sarthee"
              className="E-Sarthee-logo"
              
            />
            Install App now
          </div>
        </div>
      )}
    </div>
  );
};

export default ESarthee;
