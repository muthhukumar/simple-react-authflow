import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import "./Auth.css";
import Card from "../shared/components/UIElements/Card";
import { useHttpClient } from "../shared/hooks/http-hook";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import BackDrop from "../shared/components/UIElements/BackDrop";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import { useErrorModal } from "../shared/hooks/ErrorModal-hook";
import { useInput } from "../shared/hooks/Input-hook";
import { AuthContext } from "../shared/hooks/AuthContext-hook";

const Login: React.FC = () => {
  const [email, setEmail] = useInput();
  const [password, setPassword] = useInput();
  const [
    ,
    resetError,
    isLoading,
    resetLoading,
    httpClient,
  ] = useHttpClient();
  const [
    message,
    setMessage,
    isErrorModalOpen,
    setIsErrorModalOpen,
  ] = useErrorModal();

  const history = useHistory();

  const isAuth = useContext(AuthContext);

  const onBackDropClickHanlder = () => {
    resetError();
    resetLoading();
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //const query = `
    //mutation Login($email : String!, $password : String!){
    //  login(credentials : {email : $email , password : $password}){
    //    accesstoken
    //  }
    //}
    //`;
    let serverResponse;
    try {
     // serverResponse = await httpClient(
     //   { query, variables: { email, password } },
     //   "post",
     //   null
     // );
       serverResponse = await httpClient({
          email,
          password
       },"/user/login", "post",null );
    } catch (err) {
      setIsErrorModalOpen(true);
      setMessage(err.message);
      return;
    }

    if (!serverResponse.data.errors && serverResponse.data) {
      setIsErrorModalOpen(true);
      setMessage("Login successful");
      isAuth.login(serverResponse.data.accesstoken);
      history.push("/login");
      return;
    }

    if (serverResponse.data.errors) {
      setIsErrorModalOpen(true);
      setMessage(serverResponse.data.errors[0].message);
    }
  };

  return (
    <Card>
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
      <div className="auth-container">
        <div className="auth-title">LOGIN</div>
        <form onSubmit={onSubmitHandler}>
          <input
            placeholder="email"
            className="default-input"
            type="email"
            required
            onChange={(event) => setEmail(event.target.value)}
            value={email}
          />
          <input
            placeholder="password"
            className="default-input"
            type="password"
            required
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
          <button type="submit" className="default-btn">
            login
          </button>
        </form>
      </div>
    </Card>
  );
};
export default Login;
