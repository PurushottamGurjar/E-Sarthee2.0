import React, { useEffect ,useRef, useState} from 'react'
import "./esarthee.css"
import { io } from 'socket.io-client'
import { sartheeIcons } from '../assets/myassets';

const socket=io("https://e-sarthee.onrender.com");


const ESarthee = () => {
  const [isMenu, setIsMenu]=useState(false);
  const map = useRef(null);
  const markerRef = useRef(null); 
  const marker1Ref = useRef(null);

  useEffect(()=>{
    map.current=L.map("map").setView([27.48,76.86],15);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
      maxZoom:20,
      attribution:'&copy; OpenStreetMap | Purushottam Gurjar'
    }).addTo(map.current);

    socket.on("fetch-all-locations", (data) => {
      const { latitude, longitude } = data;

      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        console.log("new location got")
      } else {
        markerRef.current = L.marker([latitude, longitude], {
          title: "Van Location",
        }).addTo(map.current)
          .bindPopup("Van Live Location")
          .openPopup();
      }
    })

    return ()=>{
      map.current.remove();
    };

  },[]);
  



  return (
    <div>
        <div className="sarthee-heading">
          <div className="sarthee-heading-first">E-Sarthee</div>
          <div className="sarthee-heading-second">
            <div className="nav-about  each-nav-item">&lt;About Developer&gt;</div>
            <div className="nav-connect each-nav-item">Connect</div>
            <div className="nav-contact each-nav-item">Contact</div>
            <div className="nav-install each-nav-item">Install App</div>
          </div>
          <div className="sarthee-menu">
            {!isMenu && <img  className="sarthee-menu-icon" src={sartheeIcons.menu_icon2} alt="Menu" onClick={()=>setIsMenu(true)}/>}
            {isMenu && <img  className="sarthee-menu-icon" src={sartheeIcons.cross_icon} alt="cross" onClick={()=>setIsMenu(false)} />}
          </div>
        </div>
         <div id="map"></div>
        
          {isMenu && <div className="sarthee-menu-content">

             <div className="sarthee-menu-each-item">
              <div className="">About Developer</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>

             <div className="sarthee-menu-each-item">
              <div className="">Connect on LinkedIn</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>

             <div className="sarthee-menu-each-item">
              <div className="">Install App</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>

             <div className="sarthee-menu-each-item">
              <div className="">Contact</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>

             <div className="sarthee-menu-each-item">
              <div className="">Share Feeback</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>


            <div className="sarthee-menu-install">Install App now</div>
          
          </div>}
        
        
    </div>
  )
}

export default ESarthee;
