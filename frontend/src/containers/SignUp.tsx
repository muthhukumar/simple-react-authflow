import React from "react";
import "./Auth.css";
import Card from "../shared/components/UIElements/Card";
import { useHttpClient } from "../shared/hooks/http-hook";
import LoadingSpinner from "../shared/components/UIElements/LoadingSpinner";
import BackDrop from "../shared/components/UIElements/BackDrop";
import ErrorModal from "../shared/components/UIElements/ErrorModal";
import { useErrorModal } from "../shared/hooks/ErrorModal-hook";
import { useInput } from "../shared/hooks/Input-hook";

const SignUp: React.FC = () => {
   const [username, setUsername] = useInput();
   const [email, setEmail] = useInput();
   const [password, setPassword] = useInput();
   const [
      message,
      setMessage,
      isErrorModalOpen,
      setIsErrorModalOpen
   ] = useErrorModal();

   const [, resetError, isLoading, resetLoading, httpClient] = useHttpClient();

   const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = `
    mutation userSignup($email : String!, $password : String!, $username : String!){
      signup(credentials : {email : $email, password : $password, username : $username}){
        email
        isVerified
        username
      }
    }`;
      let serverResponse;
      try {
         serverResponse = await httpClient(
            { query, variables: { username, email, password } },
            "/graphql",
            "post",
            null
         );
      } catch (err) {
         setIsErrorModalOpen(true);
         setMessage(err.message);
         return;
      }

      if (!serverResponse.data.errors && serverResponse.data.data) {
         setIsErrorModalOpen(true);
         setMessage("Sign up successful");
         return;
      }

      if (serverResponse.data.errors) {
         setIsErrorModalOpen(true);
         setMessage(serverResponse.data.errors[0].message);
         return;
      }
   };

   const onBackDropClickHanlder = () => {
      resetError();
      resetLoading();
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
            <div className="auth-title">signup</div>
            <form onSubmit={onSubmitHandler}>
               <input
                  placeholder="username"
                  className="default-input"
                  type="text"
                  required
                  onChange={event => setUsername(event.target.value)}
                  value={username}
               />
               <input
                  placeholder="email"
                  className="default-input"
                  type="email"
                  required
                  onChange={event => setEmail(event.target.value)}
                  value={email}
               />
               <input
                  placeholder="password"
                  className="default-input"
                  type="password"
                  required
                  onChange={event => setPassword(event.target.value)}
                  value={password}
               />
               <button className="default-btn" type="submit">
                  Sign Up
               </button>
            </form>
         </div>
      </Card>
   );
};
export default SignUp;
