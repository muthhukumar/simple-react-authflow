import React, { useContext, useEffect, useState} from "react";

import "./Profile.css";
import Card from "../shared/components/UIElements/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../shared/hooks/AuthContext-hook";
import axios from "../util/axios";
import Axios from "axios";
import BackDrop from "../shared/components/UIElements/BackDrop";

const Profile: React.FC = () => {
  const isAuth = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({ email : "", username: ""});

  const [isLoading, setIsLoading] = useState(false);
  const {accesstoken} = isAuth;

  useEffect(() => {
  const source = Axios.CancelToken.source();
    const fetchUserData = async () => {
       console.log(userDetails);
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
          cancelToken : source.token,
          url : "/graphql",
          method: "post",
          data: { query },
          withCredentials : true,
        });
        console.log(response.data.data);
        const {email , username} = response.data.data.userDetails;
        setUserDetails({email, username});  

        setIsLoading(false);
      } catch (err) {
         if(Axios.isCancel(err)){
         }else{
            throw err;
         }
        setIsLoading(false);
      }
    };
    if (!userDetails.username || !userDetails.email) fetchUserData();
    return ()=> source.cancel();
  }, [userDetails, accesstoken]);
  
  const onBackDropClickHanlder = () => {
     setIsLoading(false);
  };

  return (
    <Card>
      {isLoading && <LoadingSpinner />}
      {isLoading && <BackDrop onClick={onBackDropClickHanlder} />}
      <div className="profile-wrapper">
        <div className="profile-title">Profile</div>
        <div className="profile-content">Name : {userDetails.username}</div>
        <div className="profile-content">Email : {userDetails.email}</div>
      </div>
    </Card>
  );
};

export default Profile;
