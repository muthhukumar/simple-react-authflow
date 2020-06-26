import React, { useEffect, useRef, useContext } from "react";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { useHistory } from "react-router-dom";

import "./SocialLogin.css";
import { AuthContext } from "../shared/hooks/AuthContext-hook";
import { useHttpClient } from "../shared/hooks/http-hook";
import { useErrorModal } from "../shared/hooks/ErrorModal-hook";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import BackDrop from "../shared/components/UIElements/BackDrop";
import ErrorModal from "../shared/components/UIElements/ErrorModal";

interface PropsType {
  type: string;
}

const SocialButton: React.FC<PropsType> = (props) => {
  const isAuth = useContext(AuthContext);
  const mounted = useRef(true);
  const history = useHistory();
  const [, resetError, isLoading, resetLoading, httpClient] = useHttpClient();
  const [
    message,
    setMessage,
    isErrorModalOpen,
    setIsErrorModalOpen,
  ] = useErrorModal();

  const responseGoogle = async (response: any) => {
    if (response.error) {
      setIsErrorModalOpen(true);
      setMessage(response.error);
    }
    const data = {
      username: response.Qt.Bd,
      email: response.Qt.Au,
      googleId: response.googleId,
    };
    let serverResponse;
    try {
      serverResponse = await httpClient(
        data,
        "/user/googleSocialLogin",
        "post",
        null
      );
    } catch (err) {
      if (mounted.current) {
        setIsErrorModalOpen(true);
        setMessage(err.message);
      }
      return;
    }
    if (!mounted.current) return;

    if (!serverResponse.data.errors && serverResponse.data) {
      setIsErrorModalOpen(true);
      setMessage("successful");
      isAuth.login(serverResponse.data.accesstoken);
      history.push("/home");
      return;
    }

    if (serverResponse.data.errors) {
      setIsErrorModalOpen(true);
      setMessage(serverResponse.data.errors[0].message);
    }
  };

  const facebookLogin = async (res: any) => {
    if (res.error) {
      setIsErrorModalOpen(true);
      setMessage(res.error);
    }
    const data = {
      username: res.name,
      email: res.email,
      facebookId: res.id,
    };
    let serverResponse;
    try {
      serverResponse = await httpClient(
        data,
        "/user/facebookSocialLogin",
        "post",
        null
      );
    } catch (err) {
      if (mounted.current) {
        setIsErrorModalOpen(true);
        setMessage(err.message);
      }
      return;
    }
    if (!mounted.current) return;

    if (!serverResponse.data.errors && serverResponse.data) {
      setIsErrorModalOpen(true);
      setMessage("successful");
      isAuth.login(serverResponse.data.accesstoken);
      history.push("/home");
      return;
    }

    if (serverResponse.data.errors) {
      setIsErrorModalOpen(true);
      setMessage(serverResponse.data.errors[0].message);
    }
  };

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const onBackDropClickHanlder = () => {
    resetError();
    resetLoading();
  };

  return (
    <div className="social-button_container">
      {isLoading && <LoadingSpinner />}
      {isLoading && <BackDrop onClick={onBackDropClickHanlder} />}
      {isErrorModalOpen && (
        <ErrorModal
          message={message}
          onClick={() => {
            setIsErrorModalOpen(false);
            setMessage("");
          }}
        />
      )}
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        render={(renderProps) => (
          <button
            className="google-btn"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            {props.type} with Google
          </button>
        )}
      />
      <div className="or">Or</div>
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
        autoLoad={false}
        fields="name,email,picture"
        textButton={`${props.type} with facebook`}
        onClick={() => {}}
        callback={facebookLogin}
        cssClass="facebook-btn"
      />
    </div>
  );
};

export default SocialButton;
