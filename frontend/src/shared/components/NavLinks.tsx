import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../hooks/AuthContext-hook";
import "./NavLinks.css";
import axios from "../../util/axios";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";

const Navigation: React.FC = () => {
   const isAuth = useContext(AuthContext);
   const [isLoading, setIsLoading] = useState(false);


   const logout = async ()=>{
      setIsLoading(true);
         try{
            await axios({url : "/user/logout", method : "get"}) 
            isAuth.logout();
            setIsLoading(false)
         }catch(err){
            setIsLoading(false)
         }
   }

   return (
      <div className="navigation-container">
         {isLoading && <LoadingSpinner/>}
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
                  <NavLink to="/home" onClick={logout}>
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
