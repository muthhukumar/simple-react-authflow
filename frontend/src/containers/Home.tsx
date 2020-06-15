import React from "react";

import Card from "../shared/components/UIElements/Card";
import "./Home.css";

const Home: React.FC = () => {
   return (
      <Card>
         <div className="home-wrapper">
            <h1>Home</h1>
            <p>
               Sign up and login using your account and get your personal data
               by access token
            </p>
         </div>
      </Card>
   );
};

export default Home;
