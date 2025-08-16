import React, { useEffect, useRef, useState } from "react";
import "./esarthee.css";
import { io } from "socket.io-client";
import { sartheeIcons } from "../assets/myassets";

const socket = io("https://e-sarthee.onrender.com");

const ESarthee = () => {
  const [color, setcolor] = useState("#007BFF"); //green #008000 //blue #003cffff //amother green #0500ff #2819fbff
  const [bgColor, setBgColor] = useState("#f4f4f7"); //#f4f4f7
  const [secBgColor, setSecBgColor] = useState("#ffffff");
  const [theme, setTheme] = useState("light");
  const [isMenu, setIsMenu] = useState(false);
  const map = useRef(null);
  const markerRef = useRef(null);
  const marker1Ref = useRef(null);

  const ChangeThemeToDark = () => {
    setTheme("dark");
    setcolor("#48ff91");
    setBgColor("#1B1B1C");
    setSecBgColor("#242426");

    if (map.current) {
      map.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.current.removeLayer(layer);
        }
      });
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 30,
          attribution:
            '&copy; <a href="https://carto.com/">CartoDB</a> | <a href="https://purushottam.online">Purushottam Gurjar</a>',
        }
      ).addTo(map.current);
    }
  };
  const ChangeThemeToLight = () => {
    setTheme("light");
    setcolor("#007BFF");
    setBgColor("#f4f4f7");
    setSecBgColor("#ffffff");

    if (map.current) {
      map.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.current.removeLayer(layer);
        }
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 30,
        attribution:
          '&copy; OpenStreetMap | <a href="https://purushottam.online/">Purushottam Gurjar</a>',
      }).addTo(map.current);
    }
  };

  useEffect(() => {
    map.current = L.map("map").setView([17.983, 79.532], 16);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 30,
      attribution:
        '&copy; OpenStreetMap |<a href="https://purushottam-gurjar.vercel.app/">Purushottam Gurjar</a>',
    }).addTo(map.current);

    const markers = {};
    const updateTimers = {};
    let dummyMarker;
    dummyMarker = L.marker([17.988107, 79.530648], {
      title: `E-Van `,
    })
      .addTo(map.current)
      .bindPopup(`E-Van at Charging Station. Will Resume shortly.`)
      .openPopup();

    socket.on("fetch-all-locations-byID", (data) => {
      const { latitude, longitude, driverID } = data;
      if (markers[driverID]) {
        markers[driverID].setLatLng([latitude, longitude]);
      } else {
        markers[driverID] = L.marker([latitude, longitude], {
          title: `E-van ${driverID}`,
        })
          .addTo(map.current)
          .bindPopup(`E-Van ${driverID}`)
          .openPopup();
      }

      if (updateTimers[driverID]) clearTimeout(updateTimers[driverID]);
      updateTimers[driverID] = setTimeout(() => {
        if (markers[driverID]) {
          map.current.removeLayer(markers[driverID]);
          delete markers[driverID];
          delete updateTimers[driverID];
        }
      }, 30000);
    });

    return () => {
      socket.off("fetch-all-locations-byID");
      map.current.remove();
    };
  }, []);

  return (
    <div style={{ backgroundColor: bgColor, height: "auto", width: "100%" }}>
      <div className="sarthee-heading" style={{ backgroundColor: bgColor }}>
        <div className="sarthee-heading-first" style={{ color: color }}>
          <div>
            <img
              className="e-sarthee-heading-logo"
              src={sartheeIcons.ESarthee_Logo}
              alt="NITW E-Sarthee"
            />
          </div>
          {theme === "light" && (
            <div
              style={{
                background:
                  "linear-gradient(to right, rgb(127, 0, 255), rgba(0, 94, 255, 1))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              className="e-sarthee-heading-text"
            >
              E-Sarthee
            </div>
          )}
          {theme === "dark" && (
            <div style={{}} className="e-sarthee-heading-text">
              E-Sarthee
            </div>
          )}
        </div>
        <div className="sarthee-heading-second">
          <div style={{ alignSelf: "center" }}>
            {/* sun */}
            {theme === "dark" && (
              <div
                onClick={() => ChangeThemeToLight()}
                style={{ marginTop: "4px" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 13 13"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#48ff91"
                >
                  {" "}
                  //#48ff91
                  <path d="M6 1V0.5C6 0.367392 6.05268 0.240215 6.14645 0.146447C6.24021 0.0526784 6.36739 0 6.5 0C6.63261 0 6.75979 0.0526784 6.85355 0.146447C6.94732 0.240215 7 0.367392 7 0.5V1C7 1.13261 6.94732 1.25979 6.85355 1.35355C6.75979 1.44732 6.63261 1.5 6.5 1.5C6.36739 1.5 6.24021 1.44732 6.14645 1.35355C6.05268 1.25979 6 1.13261 6 1ZM10.5 6.5C10.5 7.29113 10.2654 8.06448 9.82588 8.72228C9.38635 9.38008 8.76164 9.89277 8.03073 10.1955C7.29983 10.4983 6.49556 10.5775 5.71964 10.4231C4.94371 10.2688 4.23098 9.88784 3.67157 9.32843C3.11216 8.76902 2.7312 8.05628 2.57686 7.28036C2.42252 6.50444 2.50173 5.70017 2.80448 4.96927C3.10723 4.23836 3.61992 3.61365 4.27772 3.17412C4.93552 2.7346 5.70887 2.5 6.5 2.5C7.56051 2.50116 8.57725 2.92296 9.32715 3.67285C10.077 4.42275 10.4988 5.43949 10.5 6.5ZM9.5 6.5C9.5 5.90666 9.32405 5.32664 8.99441 4.83329C8.66476 4.33994 8.19623 3.95542 7.64805 3.72836C7.09987 3.5013 6.49667 3.44189 5.91473 3.55764C5.33279 3.6734 4.79824 3.95912 4.37868 4.37868C3.95912 4.79824 3.6734 5.33279 3.55764 5.91473C3.44189 6.49667 3.5013 7.09987 3.72836 7.64805C3.95542 8.19623 4.33994 8.66476 4.83329 8.99441C5.32664 9.32405 5.90666 9.5 6.5 9.5C7.2954 9.49917 8.05798 9.18284 8.62041 8.62041C9.18284 8.05798 9.49917 7.2954 9.5 6.5ZM2.14625 2.85375C2.24007 2.94757 2.36732 3.00028 2.5 3.00028C2.63268 3.00028 2.75993 2.94757 2.85375 2.85375C2.94757 2.75993 3.00028 2.63268 3.00028 2.5C3.00028 2.36732 2.94757 2.24007 2.85375 2.14625L2.35375 1.64625C2.25993 1.55243 2.13268 1.49972 2 1.49972C1.86732 1.49972 1.74007 1.55243 1.64625 1.64625C1.55243 1.74007 1.49972 1.86732 1.49972 2C1.49972 2.13268 1.55243 2.25993 1.64625 2.35375L2.14625 2.85375ZM2.14625 10.1462L1.64625 10.6462C1.55243 10.7401 1.49972 10.8673 1.49972 11C1.49972 11.1327 1.55243 11.2599 1.64625 11.3538C1.74007 11.4476 1.86732 11.5003 2 11.5003C2.13268 11.5003 2.25993 11.4476 2.35375 11.3538L2.85375 10.8538C2.90021 10.8073 2.93706 10.7521 2.9622 10.6914C2.98734 10.6308 3.00028 10.5657 3.00028 10.5C3.00028 10.4343 2.98734 10.3692 2.9622 10.3086C2.93706 10.2479 2.90021 10.1927 2.85375 10.1462C2.8073 10.0998 2.75214 10.0629 2.69145 10.0378C2.63075 10.0127 2.5657 9.99972 2.5 9.99972C2.4343 9.99972 2.36925 10.0127 2.30855 10.0378C2.24786 10.0629 2.19271 10.0998 2.14625 10.1462ZM10.5 3C10.5657 3.00005 10.6307 2.98716 10.6914 2.96207C10.7521 2.93697 10.8073 2.90017 10.8538 2.85375L11.3538 2.35375C11.4476 2.25993 11.5003 2.13268 11.5003 2C11.5003 1.86732 11.4476 1.74007 11.3538 1.64625C11.2599 1.55243 11.1327 1.49972 11 1.49972C10.8673 1.49972 10.7401 1.55243 10.6462 1.64625L10.1462 2.14625C10.0762 2.21618 10.0286 2.3053 10.0092 2.40235C9.98991 2.49939 9.99981 2.59998 10.0377 2.6914C10.0756 2.78281 10.1397 2.86092 10.222 2.91586C10.3043 2.9708 10.4011 3.00008 10.5 3ZM10.8538 10.1462C10.7599 10.0524 10.6327 9.99972 10.5 9.99972C10.3673 9.99972 10.2401 10.0524 10.1462 10.1462C10.0524 10.2401 9.99972 10.3673 9.99972 10.5C9.99972 10.6327 10.0524 10.7599 10.1462 10.8538L10.6462 11.3538C10.6927 11.4002 10.7479 11.4371 10.8086 11.4622C10.8692 11.4873 10.9343 11.5003 11 11.5003C11.0657 11.5003 11.1308 11.4873 11.1914 11.4622C11.2521 11.4371 11.3073 11.4002 11.3538 11.3538C11.4002 11.3073 11.4371 11.2521 11.4622 11.1914C11.4873 11.1308 11.5003 11.0657 11.5003 11C11.5003 10.9343 11.4873 10.8692 11.4622 10.8086C11.4371 10.7479 11.4002 10.6927 11.3538 10.6462L10.8538 10.1462ZM1 6H0.5C0.367392 6 0.240215 6.05268 0.146447 6.14645C0.0526784 6.24021 0 6.36739 0 6.5C0 6.63261 0.0526784 6.75979 0.146447 6.85355C0.240215 6.94732 0.367392 7 0.5 7H1C1.13261 7 1.25979 6.94732 1.35355 6.85355C1.44732 6.75979 1.5 6.63261 1.5 6.5C1.5 6.36739 1.44732 6.24021 1.35355 6.14645C1.25979 6.05268 1.13261 6 1 6ZM6.5 11.5C6.36739 11.5 6.24021 11.5527 6.14645 11.6464C6.05268 11.7402 6 11.8674 6 12V12.5C6 12.6326 6.05268 12.7598 6.14645 12.8536C6.24021 12.9473 6.36739 13 6.5 13C6.63261 13 6.75979 12.9473 6.85355 12.8536C6.94732 12.7598 7 12.6326 7 12.5V12C7 11.8674 6.94732 11.7402 6.85355 11.6464C6.75979 11.5527 6.63261 11.5 6.5 11.5ZM12.5 6H12C11.8674 6 11.7402 6.05268 11.6464 6.14645C11.5527 6.24021 11.5 6.36739 11.5 6.5C11.5 6.63261 11.5527 6.75979 11.6464 6.85355C11.7402 6.94732 11.8674 7 12 7H12.5C12.6326 7 12.7598 6.94732 12.8536 6.85355C12.9473 6.75979 13 6.63261 13 6.5C13 6.36739 12.9473 6.24021 12.8536 6.14645C12.7598 6.05268 12.6326 6 12.5 6Z" />
                </svg>
              </div>
            )}
            {/* //moon */}
            {theme === "light" && (
              <div
                onClick={() => ChangeThemeToDark()}
                style={{ marginTop: "4px" }}
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 4.50148C13 4.63413 12.9473 4.76135 12.8535 4.85515C12.7597 4.94895 12.6325 5.00164 12.4998 5.00164H11.4995V6.00197C11.4995 6.13462 11.4468 6.26184 11.353 6.35564C11.2592 6.44944 11.132 6.50213 10.9993 6.50213C10.8667 6.50213 10.7395 6.44944 10.6457 6.35564C10.5519 6.26184 10.4992 6.13462 10.4992 6.00197V5.00164H9.49885C9.3662 5.00164 9.23898 4.94895 9.14518 4.85515C9.05138 4.76135 8.99869 4.63413 8.99869 4.50148C8.99869 4.36883 9.05138 4.24161 9.14518 4.14781C9.23898 4.05401 9.3662 4.00131 9.49885 4.00131H10.4992V3.00099C10.4992 2.86833 10.5519 2.74111 10.6457 2.64732C10.7395 2.55352 10.8667 2.50082 10.9993 2.50082C11.132 2.50082 11.2592 2.55352 11.353 2.64732C11.4468 2.74111 11.4995 2.86833 11.4995 3.00099V4.00131H12.4998C12.6325 4.00131 12.7597 4.05401 12.8535 4.14781C12.9473 4.24161 13 4.36883 13 4.50148ZM6.99803 2.00066H7.4982V2.50082C7.4982 2.63347 7.55089 2.76069 7.64469 2.85449C7.73849 2.94829 7.86571 3.00099 7.99836 3.00099C8.13101 3.00099 8.25823 2.94829 8.35203 2.85449C8.44583 2.76069 8.49852 2.63347 8.49852 2.50082V2.00066H8.99869C9.13134 2.00066 9.25856 1.94796 9.35236 1.85416C9.44616 1.76036 9.49885 1.63314 9.49885 1.50049C9.49885 1.36784 9.44616 1.24062 9.35236 1.14682C9.25856 1.05302 9.13134 1.00033 8.99869 1.00033H8.49852V0.500164C8.49852 0.367512 8.44583 0.240294 8.35203 0.146495C8.25823 0.0526957 8.13101 0 7.99836 0C7.86571 0 7.73849 0.0526957 7.64469 0.146495C7.55089 0.240294 7.4982 0.367512 7.4982 0.500164V1.00033H6.99803C6.86538 1.00033 6.73816 1.05302 6.64436 1.14682C6.55056 1.24062 6.49787 1.36784 6.49787 1.50049C6.49787 1.63314 6.55056 1.76036 6.64436 1.85416C6.73816 1.94796 6.86538 2.00066 6.99803 2.00066ZM11.5476 8.06515C11.6059 8.13293 11.6449 8.21507 11.6606 8.30303C11.6763 8.39099 11.6682 8.48156 11.6371 8.56531C11.29 9.51181 10.7101 10.3556 9.95093 11.0189C9.19174 11.6822 8.27771 12.1436 7.2932 12.3605C6.30868 12.5774 5.28539 12.5428 4.31777 12.2599C3.35015 11.977 2.46938 11.4549 1.75673 10.7419C1.04408 10.0288 0.522524 9.14774 0.240187 8.17996C-0.0421495 7.21218 -0.0761672 6.18888 0.141274 5.20448C0.358714 4.22009 0.820608 3.30632 1.48433 2.54752C2.14805 1.78871 2.99221 1.20931 3.9389 0.862783C4.02223 0.832266 4.11217 0.824467 4.19951 0.840187C4.28684 0.855906 4.36842 0.894577 4.43588 0.952233C4.50333 1.00989 4.55424 1.08445 4.58336 1.16827C4.61249 1.2521 4.61879 1.34216 4.60162 1.42922C4.42634 2.31637 4.47227 3.23303 4.73533 4.09821C4.99839 4.9634 5.47049 5.75048 6.10992 6.38991C6.74936 7.02935 7.53644 7.50145 8.40162 7.76451C9.26681 8.02757 10.1835 8.07349 11.0706 7.89822C11.1578 7.88118 11.2479 7.88766 11.3318 7.917C11.4156 7.94634 11.4901 7.99747 11.5476 8.06515ZM10.3354 8.99545C10.2235 9.00108 10.1109 9.00421 9.99902 9.00421C8.27489 9.00239 6.62191 8.31658 5.40288 7.09732C4.18385 5.87806 3.49837 4.22495 3.49688 2.50082C3.49688 2.38891 3.49688 2.27637 3.50563 2.16446C2.84016 2.54741 2.27177 3.07842 1.84452 3.71636C1.41728 4.3543 1.14263 5.08204 1.04187 5.84319C0.941107 6.60434 1.01693 7.37848 1.26347 8.10561C1.51001 8.83275 1.92064 9.49337 2.46356 10.0363C3.00647 10.5792 3.66709 10.9898 4.39422 11.2364C5.12136 11.4829 5.89549 11.5587 6.65665 11.458C7.4178 11.3572 8.14554 11.0826 8.78348 10.6553C9.42142 10.2281 9.95243 9.65968 10.3354 8.9942V8.99545Z"
                    fill="#007BFF"
                  />
                </svg>
              </div>
            )}
          </div>

          <div
            className="nav-about  each-nav-item"
            style={{ color: color }}
            onClick={() => window.open("https://purushottam.online", "_self")}
          >
            &lt;About Developer&gt;
          </div>
          <div
            className="nav-connect each-nav-item"
            // border:`2px solid ${color}`
            style={{ color: color }}
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
            style={{ color: color }}
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
            style={{ color: color }}
            onClick={() =>
              window.open(
                "https://contact-purushottam-gurjar.vercel.app/",
                "_self"
              )
            }
          >
            Contact
          </div>
        </div>
        <div className="sarthee-menu">
          <div style={{ alignSelf: "center" }}>
            {/* sun */}
            {theme === "dark" && (
              <div
                onClick={() => ChangeThemeToLight()}
                style={{ marginTop: "4px" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 13 13"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#48ff91"
                >
                  <path d="M6 1V0.5C6 0.367392 6.05268 0.240215 6.14645 0.146447C6.24021 0.0526784 6.36739 0 6.5 0C6.63261 0 6.75979 0.0526784 6.85355 0.146447C6.94732 0.240215 7 0.367392 7 0.5V1C7 1.13261 6.94732 1.25979 6.85355 1.35355C6.75979 1.44732 6.63261 1.5 6.5 1.5C6.36739 1.5 6.24021 1.44732 6.14645 1.35355C6.05268 1.25979 6 1.13261 6 1ZM10.5 6.5C10.5 7.29113 10.2654 8.06448 9.82588 8.72228C9.38635 9.38008 8.76164 9.89277 8.03073 10.1955C7.29983 10.4983 6.49556 10.5775 5.71964 10.4231C4.94371 10.2688 4.23098 9.88784 3.67157 9.32843C3.11216 8.76902 2.7312 8.05628 2.57686 7.28036C2.42252 6.50444 2.50173 5.70017 2.80448 4.96927C3.10723 4.23836 3.61992 3.61365 4.27772 3.17412C4.93552 2.7346 5.70887 2.5 6.5 2.5C7.56051 2.50116 8.57725 2.92296 9.32715 3.67285C10.077 4.42275 10.4988 5.43949 10.5 6.5ZM9.5 6.5C9.5 5.90666 9.32405 5.32664 8.99441 4.83329C8.66476 4.33994 8.19623 3.95542 7.64805 3.72836C7.09987 3.5013 6.49667 3.44189 5.91473 3.55764C5.33279 3.6734 4.79824 3.95912 4.37868 4.37868C3.95912 4.79824 3.6734 5.33279 3.55764 5.91473C3.44189 6.49667 3.5013 7.09987 3.72836 7.64805C3.95542 8.19623 4.33994 8.66476 4.83329 8.99441C5.32664 9.32405 5.90666 9.5 6.5 9.5C7.2954 9.49917 8.05798 9.18284 8.62041 8.62041C9.18284 8.05798 9.49917 7.2954 9.5 6.5ZM2.14625 2.85375C2.24007 2.94757 2.36732 3.00028 2.5 3.00028C2.63268 3.00028 2.75993 2.94757 2.85375 2.85375C2.94757 2.75993 3.00028 2.63268 3.00028 2.5C3.00028 2.36732 2.94757 2.24007 2.85375 2.14625L2.35375 1.64625C2.25993 1.55243 2.13268 1.49972 2 1.49972C1.86732 1.49972 1.74007 1.55243 1.64625 1.64625C1.55243 1.74007 1.49972 1.86732 1.49972 2C1.49972 2.13268 1.55243 2.25993 1.64625 2.35375L2.14625 2.85375ZM2.14625 10.1462L1.64625 10.6462C1.55243 10.7401 1.49972 10.8673 1.49972 11C1.49972 11.1327 1.55243 11.2599 1.64625 11.3538C1.74007 11.4476 1.86732 11.5003 2 11.5003C2.13268 11.5003 2.25993 11.4476 2.35375 11.3538L2.85375 10.8538C2.90021 10.8073 2.93706 10.7521 2.9622 10.6914C2.98734 10.6308 3.00028 10.5657 3.00028 10.5C3.00028 10.4343 2.98734 10.3692 2.9622 10.3086C2.93706 10.2479 2.90021 10.1927 2.85375 10.1462C2.8073 10.0998 2.75214 10.0629 2.69145 10.0378C2.63075 10.0127 2.5657 9.99972 2.5 9.99972C2.4343 9.99972 2.36925 10.0127 2.30855 10.0378C2.24786 10.0629 2.19271 10.0998 2.14625 10.1462ZM10.5 3C10.5657 3.00005 10.6307 2.98716 10.6914 2.96207C10.7521 2.93697 10.8073 2.90017 10.8538 2.85375L11.3538 2.35375C11.4476 2.25993 11.5003 2.13268 11.5003 2C11.5003 1.86732 11.4476 1.74007 11.3538 1.64625C11.2599 1.55243 11.1327 1.49972 11 1.49972C10.8673 1.49972 10.7401 1.55243 10.6462 1.64625L10.1462 2.14625C10.0762 2.21618 10.0286 2.3053 10.0092 2.40235C9.98991 2.49939 9.99981 2.59998 10.0377 2.6914C10.0756 2.78281 10.1397 2.86092 10.222 2.91586C10.3043 2.9708 10.4011 3.00008 10.5 3ZM10.8538 10.1462C10.7599 10.0524 10.6327 9.99972 10.5 9.99972C10.3673 9.99972 10.2401 10.0524 10.1462 10.1462C10.0524 10.2401 9.99972 10.3673 9.99972 10.5C9.99972 10.6327 10.0524 10.7599 10.1462 10.8538L10.6462 11.3538C10.6927 11.4002 10.7479 11.4371 10.8086 11.4622C10.8692 11.4873 10.9343 11.5003 11 11.5003C11.0657 11.5003 11.1308 11.4873 11.1914 11.4622C11.2521 11.4371 11.3073 11.4002 11.3538 11.3538C11.4002 11.3073 11.4371 11.2521 11.4622 11.1914C11.4873 11.1308 11.5003 11.0657 11.5003 11C11.5003 10.9343 11.4873 10.8692 11.4622 10.8086C11.4371 10.7479 11.4002 10.6927 11.3538 10.6462L10.8538 10.1462ZM1 6H0.5C0.367392 6 0.240215 6.05268 0.146447 6.14645C0.0526784 6.24021 0 6.36739 0 6.5C0 6.63261 0.0526784 6.75979 0.146447 6.85355C0.240215 6.94732 0.367392 7 0.5 7H1C1.13261 7 1.25979 6.94732 1.35355 6.85355C1.44732 6.75979 1.5 6.63261 1.5 6.5C1.5 6.36739 1.44732 6.24021 1.35355 6.14645C1.25979 6.05268 1.13261 6 1 6ZM6.5 11.5C6.36739 11.5 6.24021 11.5527 6.14645 11.6464C6.05268 11.7402 6 11.8674 6 12V12.5C6 12.6326 6.05268 12.7598 6.14645 12.8536C6.24021 12.9473 6.36739 13 6.5 13C6.63261 13 6.75979 12.9473 6.85355 12.8536C6.94732 12.7598 7 12.6326 7 12.5V12C7 11.8674 6.94732 11.7402 6.85355 11.6464C6.75979 11.5527 6.63261 11.5 6.5 11.5ZM12.5 6H12C11.8674 6 11.7402 6.05268 11.6464 6.14645C11.5527 6.24021 11.5 6.36739 11.5 6.5C11.5 6.63261 11.5527 6.75979 11.6464 6.85355C11.7402 6.94732 11.8674 7 12 7H12.5C12.6326 7 12.7598 6.94732 12.8536 6.85355C12.9473 6.75979 13 6.63261 13 6.5C13 6.36739 12.9473 6.24021 12.8536 6.14645C12.7598 6.05268 12.6326 6 12.5 6Z" />
                </svg>
              </div>
            )}
            {/* //moon */}
            {theme === "light" && (
              <div
                onClick={() => ChangeThemeToDark()}
                style={{ marginTop: "4px" }}
              >
                <svg
                  width="24px"
                  height="24px"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 4.50148C13 4.63413 12.9473 4.76135 12.8535 4.85515C12.7597 4.94895 12.6325 5.00164 12.4998 5.00164H11.4995V6.00197C11.4995 6.13462 11.4468 6.26184 11.353 6.35564C11.2592 6.44944 11.132 6.50213 10.9993 6.50213C10.8667 6.50213 10.7395 6.44944 10.6457 6.35564C10.5519 6.26184 10.4992 6.13462 10.4992 6.00197V5.00164H9.49885C9.3662 5.00164 9.23898 4.94895 9.14518 4.85515C9.05138 4.76135 8.99869 4.63413 8.99869 4.50148C8.99869 4.36883 9.05138 4.24161 9.14518 4.14781C9.23898 4.05401 9.3662 4.00131 9.49885 4.00131H10.4992V3.00099C10.4992 2.86833 10.5519 2.74111 10.6457 2.64732C10.7395 2.55352 10.8667 2.50082 10.9993 2.50082C11.132 2.50082 11.2592 2.55352 11.353 2.64732C11.4468 2.74111 11.4995 2.86833 11.4995 3.00099V4.00131H12.4998C12.6325 4.00131 12.7597 4.05401 12.8535 4.14781C12.9473 4.24161 13 4.36883 13 4.50148ZM6.99803 2.00066H7.4982V2.50082C7.4982 2.63347 7.55089 2.76069 7.64469 2.85449C7.73849 2.94829 7.86571 3.00099 7.99836 3.00099C8.13101 3.00099 8.25823 2.94829 8.35203 2.85449C8.44583 2.76069 8.49852 2.63347 8.49852 2.50082V2.00066H8.99869C9.13134 2.00066 9.25856 1.94796 9.35236 1.85416C9.44616 1.76036 9.49885 1.63314 9.49885 1.50049C9.49885 1.36784 9.44616 1.24062 9.35236 1.14682C9.25856 1.05302 9.13134 1.00033 8.99869 1.00033H8.49852V0.500164C8.49852 0.367512 8.44583 0.240294 8.35203 0.146495C8.25823 0.0526957 8.13101 0 7.99836 0C7.86571 0 7.73849 0.0526957 7.64469 0.146495C7.55089 0.240294 7.4982 0.367512 7.4982 0.500164V1.00033H6.99803C6.86538 1.00033 6.73816 1.05302 6.64436 1.14682C6.55056 1.24062 6.49787 1.36784 6.49787 1.50049C6.49787 1.63314 6.55056 1.76036 6.64436 1.85416C6.73816 1.94796 6.86538 2.00066 6.99803 2.00066ZM11.5476 8.06515C11.6059 8.13293 11.6449 8.21507 11.6606 8.30303C11.6763 8.39099 11.6682 8.48156 11.6371 8.56531C11.29 9.51181 10.7101 10.3556 9.95093 11.0189C9.19174 11.6822 8.27771 12.1436 7.2932 12.3605C6.30868 12.5774 5.28539 12.5428 4.31777 12.2599C3.35015 11.977 2.46938 11.4549 1.75673 10.7419C1.04408 10.0288 0.522524 9.14774 0.240187 8.17996C-0.0421495 7.21218 -0.0761672 6.18888 0.141274 5.20448C0.358714 4.22009 0.820608 3.30632 1.48433 2.54752C2.14805 1.78871 2.99221 1.20931 3.9389 0.862783C4.02223 0.832266 4.11217 0.824467 4.19951 0.840187C4.28684 0.855906 4.36842 0.894577 4.43588 0.952233C4.50333 1.00989 4.55424 1.08445 4.58336 1.16827C4.61249 1.2521 4.61879 1.34216 4.60162 1.42922C4.42634 2.31637 4.47227 3.23303 4.73533 4.09821C4.99839 4.9634 5.47049 5.75048 6.10992 6.38991C6.74936 7.02935 7.53644 7.50145 8.40162 7.76451C9.26681 8.02757 10.1835 8.07349 11.0706 7.89822C11.1578 7.88118 11.2479 7.88766 11.3318 7.917C11.4156 7.94634 11.4901 7.99747 11.5476 8.06515ZM10.3354 8.99545C10.2235 9.00108 10.1109 9.00421 9.99902 9.00421C8.27489 9.00239 6.62191 8.31658 5.40288 7.09732C4.18385 5.87806 3.49837 4.22495 3.49688 2.50082C3.49688 2.38891 3.49688 2.27637 3.50563 2.16446C2.84016 2.54741 2.27177 3.07842 1.84452 3.71636C1.41728 4.3543 1.14263 5.08204 1.04187 5.84319C0.941107 6.60434 1.01693 7.37848 1.26347 8.10561C1.51001 8.83275 1.92064 9.49337 2.46356 10.0363C3.00647 10.5792 3.66709 10.9898 4.39422 11.2364C5.12136 11.4829 5.89549 11.5587 6.65665 11.458C7.4178 11.3572 8.14554 11.0826 8.78348 10.6553C9.42142 10.2281 9.95243 9.65968 10.3354 8.9942V8.99545Z"
                    fill="#007BFF"
                  />
                </svg>
              </div>
            )}
          </div>
          {!isMenu && (
            <div style={{ marginTop: "5px" }}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setIsMenu(!isMenu)}
              >
                <rect x="3" y="5" width="16" height="2.5" rx="1" fill={color} />
                <rect
                  x="3"
                  y="10"
                  width="16"
                  height="2.5"
                  rx="1"
                  fill={color}
                />
                <rect
                  x="3"
                  y="15"
                  width="16"
                  height="2.5"
                  rx="1"
                  fill={color}
                />
              </svg>
            </div>
          )}
          {isMenu && (
            <div style={{ marginTop: "4px" }}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setIsMenu(!isMenu)}
              >
                <rect
                  x="3.6"
                  y="11"
                  width="16.8"
                  height="2"
                  rx="1"
                  fill={color}
                  transform="rotate(45 12 12)"
                />
                <rect
                  x="3.6"
                  y="11"
                  width="16.8"
                  height="2"
                  rx="1"
                  fill={color}
                  transform="rotate(-45 12 12)"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="sarthee-map-about">
        <div id="map"></div>

          <div className="sarthee-map-about-about" style={{backgroundColor:secBgColor}}>
            <h3 className="sarthee-map-about-about-title" style={{color:color}}>
              💭 Born from Real Experience
            </h3>
            <p className="sarthee-map-about-about-description"  style={{ color: theme === "light" ? "black" : "white" }}>
              "During my second year, those daily 30-minute waits for the van
              from blocks to department frustrated me. I thought - why can't we
              just know where the van is? That's how E-sarthee was born. A
              platform that puts campus transport at your fingertips, because no
              student should waste time wondering when their ride will arrive."
              - The E-sarthee Story
            </p>
            <h3 className="sarthee-map-about-about-author" style={{ color: theme === "light" ? "black" : "white" }}>
              --- Purushottam Gurjar
            </h3>

          </div>

      </div>



      {/* <div className="sarthee-map-about ">
        <div className="sarthee-map-about-map">
          <div
            style={{width: "50%", height: "70vh",borderRadius: "20px",border: "2px solid black", marginTop: "4px",}} id="map"></div>
          <div className="sarthee-map-about-about">
            <div className="sarthee-map-about-about-icon">🚐</div>
            <h3 className="sarthee-map-about-about-title">Real-Time Van Tracking</h3>
            <p className="sarthee-map-about-about-description">
              Know exactly where your E-van is! No more 30-minute waits
              wondering if the van will come. Track location, arrival time, and
              route updates instantly.
            </p>
          </div>
          <div className="why-sarthee-feature-card">
            <div className="why-sarthee-card-icon">🚐</div>
            <h3 className="why-sarthee-card-title">Real-Time Van Tracking</h3>
            <p className="why-sarthee-card-description">
              Know exactly where your E-van is! No more 30-minute waits
              wondering if the van will come. Track location, arrival time, and
              route updates instantly.
            </p>
          </div>

          <div className="why-sarthee-feature-card">
            <div className="why-sarthee-card-icon">🎓</div>
            <h3 className="why-sarthee-card-title">
              By Engineers, For Engineers
            </h3>
            <p className="why-sarthee-card-description">
              Crafted by Purushottam Gurjar, a fellow engineer who understood
              the daily struggle of campus commuting and designed the perfect
              solution.
            </p>
          </div>

          
        </div>
      </div> */}

      <div className="feature-cards">
        <div
          className="banner"
          style={{
            backgroundColor: secBgColor,
            color: color,
            border: "1px solid #424d46ff",
          }}
        >
          <div className="icon">💲</div>
          <h3>Zero Infrastructure Cost</h3>
          <p style={{ color: theme === "light" ? "black" : "white" }}>
            Track locations without investing in expensive GPS hardware.
          </p>
        </div>

        <div
          className="banner"
          style={{ backgroundColor: secBgColor, color: color }}
        >
          <div className="icon">📍</div>
          <h3>Precise Location</h3>
          <p style={{ color: theme === "light" ? "black" : "white" }}>
            Highly accurate positioning powered by GPS technology.
          </p>
        </div>

        <div
          className="banner"
          style={{ backgroundColor: secBgColor, color: color }}
        >
          <div className="icon">⚡</div>
          <h3>Real-time Tracking</h3>
          <p style={{ color: theme === "light" ? "black" : "white" }}>
            Monitor E-Vans live with instant location updates on your device.
          </p>
        </div>

        <div
          className="banner"
          style={{ backgroundColor: secBgColor, color: color }}
        >
          <div className="icon">🚌</div>
          <h3>Multi-Van System</h3>
          <p style={{ color: theme === "light" ? "black" : "white" }}>
            View the real-time locations of multiple E-Vans on one system.
          </p>
        </div>
      </div>

      {isMenu && (
        <div
          className="sarthee-menu-content"
          style={{ backgroundColor: bgColor }}
        >
          <div
            className="sarthee-menu-each-item"
            style={{
              backgroundColor: secBgColor,
              color: theme === "light" ? "black" : "white",
            }}
            onClick={() =>
              window.open("https://purushottam-gurjar.vercel.app", "_self")
            }
          >
            <div className="">About Developer</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="15"
              viewBox="0 0 9 15"
              fill="none"
            >
              <path
                d="M1 1.5L7 7.5L1 13.5"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div
            className="sarthee-menu-each-item"
            style={{
              backgroundColor: secBgColor,
              color: theme === "light" ? "black" : "white",
            }}
            onClick={() =>
              window.open(
                "https://www.linkedin.com/in/purushottam-gurjar/",
                "_self"
              )
            }
          >
            <div className="">Connect on LinkedIn</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="15"
              viewBox="0 0 9 15"
              fill="none"
            >
              <path
                d="M1 1.5L7 7.5L1 13.5"
                stroke={color}
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div
            className="sarthee-menu-each-item"
            style={{
              backgroundColor: secBgColor,
              color: theme === "light" ? "black" : "white",
            }}
            onClick={() =>
              window.open(
                "https://github.com/PurushottamGurjar/E-Sarthee2.0",
                "_self"
              )
            }
          >
            <div className="">Contribute - Github</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="15"
              viewBox="0 0 9 15"
              fill="none"
            >
              <path
                d="M1 1.5L7 7.5L1 13.5"
                stroke={color}
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div
            className="sarthee-menu-each-item"
            style={{
              backgroundColor: secBgColor,
              color: theme === "light" ? "black" : "white",
            }}
            onClick={() =>
              window.open(
                "https://contact-purushottam-gurjar.vercel.app",
                "_self"
              )
            }
          >
            <div className="">Contact</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="15"
              viewBox="0 0 9 15"
              fill="none"
            >
              <path
                d="M1 1.5L7 7.5L1 13.5"
                stroke={color}
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div
            className="sarthee-menu-each-item"
            style={{
              backgroundColor: secBgColor,
              color: theme === "light" ? "black" : "white",
            }}
          >
            <div className="">Share Feeback</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="15"
              viewBox="0 0 9 15"
              fill="none"
            >
              <path
                d="M1 1.5L7 7.5L1 13.5"
                stroke={color}
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div
            className="sarthee-menu-install"
            onClick={() =>
              window.open(
                "https://drive.google.com/file/d/1iu45q_N4dNKALPMFch-fknrKSDDWVow0/view?usp=sharing",
                "_self"
              )
            }
            style={{
              backgroundColor: color,
              color: theme === "light" ? "white" : "black",
            }}
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
