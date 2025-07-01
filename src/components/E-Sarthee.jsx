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
            <div className="nav-about  each-nav-item" onClick={()=>window.open("https://purushottam-gurjar.vercel.app",'_self')}>&lt;About Developer&gt;</div>
            <div className="nav-connect each-nav-item" onClick={()=>window.open("https://www.linkedin.com/in/purushottam-gurjar/",'_self')} >Connect</div>
            <div className="nav-connect each-nav-item" onClick={()=>window.open("https://github.com/PurushottamGurjar/E-Sarthee2.0",'_self')} >Contribute</div>
            <div className="nav-contact each-nav-item" onClick={()=>window.open("https://contact-purushottam-gurjar.vercel.app",'_self')}>Contact</div>
            
            <div className="nav-install each-nav-item">Install App</div>
          </div>
          <div className="sarthee-menu">
            {!isMenu && <img  className="sarthee-menu-icon" src={sartheeIcons.menu_icon2} alt="Menu" onClick={()=>setIsMenu(true)}/>}
            {isMenu && <img  className="sarthee-menu-icon" src={sartheeIcons.cross_icon} alt="cross" onClick={()=>setIsMenu(false)} />}
          </div>
        </div>
         <div id="map"></div>
        
          {isMenu && <div className="sarthee-menu-content">

             <div className="sarthee-menu-each-item"
              onClick={()=>window.open("https://purushottam-gurjar.vercel.app",'_self')}>
              <div className="">About Developer</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>

             <div className="sarthee-menu-each-item"
             onClick={()=>window.open("https://www.linkedin.com/in/purushottam-gurjar/",'_self')}>
              <div className="">Connect on LinkedIn</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>

             <div className="sarthee-menu-each-item"
             onClick={()=>window.open("https://github.com/PurushottamGurjar/E-Sarthee2.0",'_self')}>
              <div className="">Contribute - Github</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>


             <div className="sarthee-menu-each-item"
             onClick={()=>window.open("https://contact-purushottam-gurjar.vercel.app",'_self')}>
              <div className="">Contact</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>

             <div className="sarthee-menu-each-item">
              <div className="">Share Feeback</div>
              <img src={sartheeIcons.rightarrow_icon} alt="open" />
             </div>


            <div className="sarthee-menu-install" onClick={()=>window.open("https://drive.google.com/file/d/1lSNbT9ABIMsVvzVEMcvJyil7_FJzCp4A/view?usp=sharing","_self")}>
              <img src={sartheeIcons.ESarthee_Logo} alt="E-Sarthee" className="E-Sarthee-logo" />
              Install App now</div>
          
          </div>}
        
        
    </div>
  )
}

export default ESarthee;
