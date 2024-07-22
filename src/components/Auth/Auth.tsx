import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase";
import { setUserName, toogleIsSigningUp } from "../../reducers/userReducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import styles from "./Auth.module.scss";

const Auth: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userName } = useAppSelector((state) => state.user);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSignUp, setIsSignUp] = useState<boolean>(true);

  const errHandling = (err: { code: string }) => {
    setError(`Error: ${err.code.split("/")[1]}`);
    console.error(err);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (isSignUp) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          dispatch(toogleIsSigningUp());
        })
        .catch(errHandling);
    } else {
      signInWithEmailAndPassword(auth, email, password).catch(errHandling);
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value.length > 10) {
      e.preventDefault();
    } else {
      dispatch(setUserName(e.target.value));
    }
  };

  return (
    <section className={styles.auth}>
      <div>
        <div className={styles.boxBtn}>
          <button disabled={isSignUp} onClick={() => setIsSignUp(true)}>
            Sign up
          </button>
          <button disabled={!isSignUp} onClick={() => setIsSignUp(false)}>
            Log in
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              type="text"
              placeholder="Username"
              onChange={handleChange}
              value={userName}
              required
              autoComplete="username"
            />
          )}
          <div>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="flex justify-center">
            <button type="submit">Submit</button>
          </div>
          {error && <p className="text-red-500 mt-3">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default Auth;
