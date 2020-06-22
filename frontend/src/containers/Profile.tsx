import React, { useContext, useEffect, useState } from "react";

import "./Profile.css";
import Card from "../shared/components/UIElements/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../shared/hooks/AuthContext-hook";
import axios from "../util/axios";
import BackDrop from "../shared/components/UIElements/BackDrop";

const Profile: React.FC = () => {
  const isAuth = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {accesstoken} = isAuth;

  useEffect(() => {
    const fetchUserData = async () => {
      let response;
      const query = `
        query GetUserDetails{
          userDetails{
            username
            email
          }
        }
      
      `;

      setIsLoading(true);
      try {
        response = await axios({
          headers: {
            Authorization: "Bearer " +accesstoken,
          },
          url : "/graphql",
          method: "post",
          data: { query },
          withCredentials : true,
        });
        setName(response.data.data.userDetails.username);
        setEmail(response.data.data.userDetails.email);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        return;
      }
    };
    if (!name || !email) fetchUserData();
  }, [email, accesstoken, name]);
  

  const onBackDropClickHanlder = () => {
     setIsLoading(false);
  };

  return (
    <Card>
      {isLoading && <LoadingSpinner />}
      {isLoading && <BackDrop onClick={onBackDropClickHanlder} />}
      <div className="profile-wrapper">
        <div className="profile-title">Profile</div>
        <div className="profile-content">Name : {name}</div>
        <div className="profile-content">Email : {email}</div>
      </div>
    </Card>
  );
};

export default Profile;
