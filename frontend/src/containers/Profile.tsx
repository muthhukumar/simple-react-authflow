import React, { useRef, useContext, useEffect, useState } from "react";

import "./Profile.css";
import Card from "../shared/components/UIElements/Card";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../shared/hooks/AuthContext-hook";
import axios from "../util/axios";
import Axios from "axios";
import BackDrop from "../shared/components/UIElements/BackDrop";

const Profile: React.FC = () => {
  const isAuth = useContext(AuthContext);
  const email = useRef<string>("");
  const username = useRef<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const { accesstoken } = isAuth;

  useEffect(() => {
    const source = Axios.CancelToken.source();
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
            Authorization: "Bearer " + accesstoken,
          },
          cancelToken: source.token,
          url: "/graphql",
          method: "post",
          data: { query },
          withCredentials: true,
        });
        const {
          email: userEmail,
          username: userUsername,
        } = response.data.data.userDetails;
        email.current = userEmail;
        username.current = userUsername;
        setIsLoading(false);
      } catch (err) {
        if (Axios.isCancel(err)) {
        } else {
          throw err;
        }
        setIsLoading(false);
      }
    };
    if (!username.current || !email.current) fetchUserData();

    return () => source.cancel();
  }, [accesstoken]);

  const onBackDropClickHanlder = () => {
    setIsLoading(false);
  };

  return (
    <Card>
      {isLoading && <LoadingSpinner />}
      {isLoading && <BackDrop onClick={onBackDropClickHanlder} />}
      <div className="profile-wrapper">
        <div className="profile-title">Profile</div>
        <div className="profile-content">
          <div>Name </div> <div>{username.current}</div>
        </div>
        <div className="profile-content">
          <div>Email </div> <div>{email.current}</div>
        </div>
      </div>
    </Card>
  );
};

export default Profile;
