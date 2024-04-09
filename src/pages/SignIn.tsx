import {
  AuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { FC, useState, FormEvent } from "react";

import Alert from "../components/Alert";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../shared/firebase";
import { useQueryParams } from "../hooks/useQueryParams";
import { useStore } from "../store";
import PhoneSignUp from "./PhoneSignUp";

const SignIn: FC = () => {
  const { redirect } = useQueryParams();

  const currentUser = useStore((state) => state.currentUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const [isPhoneOpened, setisPhoneOpened] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSignIn = (provider: AuthProvider) => {
    setLoading(true);

    signInWithPopup(auth, provider)
      .then((res) => {
        console.log(res.user);
      })
      .catch((err) => {
        setIsAlertOpened(true);
        setError(`Error: ${err.code}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const login = (e: FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {})
      .catch(() => setError("Email is not available"));
  };

  if (currentUser) return <Navigate to={redirect || "/"} />;

  return (
    <>
      <div className="bg-white flex h-screen flex-1 justify-center ">
        <div className="w-full max-w-[1100px]">
          <div className="flex justify-between">
            <div className="mt-9 flex items-center gap-2">
              <img className="h-8 w-8" src="/icon.svg" alt="" />
              <span className="text-dark text-2xl">Telepro</span>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-10 md:mt-2 md:flex-row md:gap-5 lg:mt-10">
            <div className="flex-1">
              <span className="flex justify-between m-5"  style={{fontSize:"36px",color:"black" ,fontWeight:"inherit"}}>Welcome to Telepro</span>
              <span  style={{fontSize:"16px",color:"black" ,fontWeight:"inherit"}}>Discover utilities that support working and chatting with family and friends optimized for your computer.</span>
              <img
                style={{ width: "650px", height: "400px" }}
                src="/sigin.jpg"
                alt=""
              />
            </div>

            <div className=" bg-lighten mt-12 flex flex-1 flex-col items-center gap-4  "
            style={{height:"500px",borderRadius:"10px",boxShadow:"-5px 5px 25px 5px RGBA( 220, 220, 220, 1 )"}}>
              <h1 className="text-dark text-center text-3xl md:text-left md:text-4xl p-3" style={{fontWeight:"bold"}}>
                Sign in or create an account
              </h1>
              <br/>
              <div className="flex items-center justify-center gap-4">
                <form onSubmit={login}>
                  <div className="p-2 ">
                    <input
                      className="form-control  bg-light text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                      type="email"
                      value={email}
                      required
                      placeholder="Email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="p-2">
                    <input
                      className="flex min-w-[400px] form-control border-lighten bg-light text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                      type="password"
                      value={password}
                      required
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-1 d-flex justify-content-end p-2 text-black">
                    <a href="#" className="text-link  "><i>Quên mật khẩu?</i> </a>
                  </div>
                  <div className="p-2 flex flex-col items-center justify-center " >
                    <button
                      style={{ color: "#FFFFFF", backgroundColor: "#0068FF",alignItems:"center" ,justifyContent:"center"}}
                      className="flex min-w-[200px] cursor-pointer items-center gap-3 rounded-md bg-white p-2 text-black transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
              <div className="flex items-center p-2">
                <div className="p-2">
                  <button
                    disabled={loading}
                    onClick={() => handleSignIn(new GoogleAuthProvider())}
                    className="flex min-w-[200px] cursor-pointer items-center gap-3 rounded-md bg-white p-2 text-black transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75"
                  >
                    <img className="h-6 w-5" src="/google.svg" alt="" />
                    <span>Sign In With Google</span>
                  </button>
                </div>
                <div className="p-3">
                  <button
                    disabled={loading}
                    onClick={() => handleSignIn(new FacebookAuthProvider())}
                    className="bg-primary flex min-w-[150px] cursor-pointer items-center gap-3 rounded-md p-2 text-white transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75"
                  >
                    <img className="h-6 w-5" src="/facebook.svg" alt="" />
                    <span>Sign In With Facebook</span>
                  </button>
                </div>
              </div>
              <p style={{ color: "black" }}>
                You don't have an account?
                <Link
                  style={{ color: "#0068FF", textDecoration: "none" }}
                  to="/register"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div> 
      </div>
      <PhoneSignUp isOpened={isPhoneOpened} setIsOpened={setisPhoneOpened} />
      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text={"Please sign in to join"}
        isError
      />
    </>
  );
};

export default SignIn;
