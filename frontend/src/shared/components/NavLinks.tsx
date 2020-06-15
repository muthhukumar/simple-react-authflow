import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../hooks/AuthContext-hook";
import "./NavLinks.css";

const Navigation: React.FC = () => {
   const isAuth = useContext(AuthContext);
   return (
      <div className="navigation-container">
         <ul>
            {
               <li>
                  <NavLink to="/home">Home</NavLink>
               </li>
            }
            {!isAuth.accesstoken && (
               <li>
                  <NavLink to="/signup">SignUp</NavLink>
               </li>
            )}
            {!isAuth.accesstoken && (
               <li>
                  <NavLink to="/login">Login</NavLink>
               </li>
            )}
            {isAuth.accesstoken && (
               <li>
                  <NavLink to="/profile">Profile</NavLink>
               </li>
            )}
            {isAuth.accesstoken && (
               <li>
                  <NavLink to="/home" onClick={() => isAuth.logout()}>
                     LOGOUT
                  </NavLink>
               </li>
            )}
         </ul>
         <div className="hamburger-nav">
            <div></div>
            <div></div>
            <div></div>
         </div>
      </div>
   );
};

export default Navigation;
