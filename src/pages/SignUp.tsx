import { FC, FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { auth, db } from "../shared/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useStore } from "../store";
import { doc, setDoc } from "firebase/firestore";

const SignUp: FC = () => {
  const navigate = useNavigate();

  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [error, setError] = useState<string>("");
  const [registering, setRegistering] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [expandForm, setExpandForm] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'email' | 'phone'>('email');
  const [OTP, setOTP] = useState("");

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response: string) => {},
      },
      auth
    );
  };

  const requestOTP = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Please make sure your passwords match.");
      return;
    }
    // Kiểm tra mật khẩu có ít nhất một ký tự viết hoa và một ký tự đặc biệt
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/;
    if (!passwordRegex.test(password)) {
      setError("Password must contain at least one uppercase letter and one special character.");
      return;
    }
    if (verificationMethod === 'phone' && phoneNumber.length >= 10) {
      setExpandForm(true);
      generateRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (verificationMethod === 'email' && email.trim() !== "") {
      setExpandForm(true);
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await sendEmailVerification(user);
        setCurrentUser(user);
        navigate('/');
      } catch (error) {
        setError(error.message || 'An error occurred.');
      }
    }
  };

  const vertifyOTP = (e: any) => {
    const otp = e.target.value;
    setOTP(otp);
    if (otp.length === 6) {
      window.confirmationResult
        .confirm(otp)
        .then(async (result: any) => {
          const users = result.user;
          const res = await createUserWithEmailAndPassword(auth, email, password);
          onAuthStateChanged(auth, (users) => {
            if (users) {
              setCurrentUser(users);
              setDoc(doc(db, "users", users.uid), {
                uid: users.uid,
                email: email,
                displayName: displayName,
                photoURL: users.photoURL,
                phoneNumber: users.phoneNumber,
              });
            } else {
              setCurrentUser(null);
            }
          });
        })
        .catch((error: any) => {});
    }
  };

  const handleSignIn = () => {
    // Define your sign-in logic here
  };

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-white flex h-screen flex-1 justify-center text-black">
      <div className="w-full max-w-[1100px]">
        <div className="flex justify-between">
          <div className="mt-9 flex items-center gap-2">
            <img className="h-8 w-8" src="/icon.svg" alt="" />
            <span className="text-dark text-2xl">Telepro</span>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-10 md:mt-2 md:flex-row md:gap-5 lg:mt-10">
          <div className="flex-1">
            <span className="flex justify-between m-5" style={{ fontSize: "36px", color: "black", fontWeight: "inherit" }}>
              Welcome to Telepro
            </span>
            <span style={{ fontSize: "16px", color: "black", fontWeight: "inherit" }}>
              Discover utilities that support working and chatting with family and friends optimized for your computer.
            </span>
            <img style={{ width: "650px", height: "400px" }} src="/sigin.jpg" alt="" />
          </div>
          <div className=" bg-lighten  flex flex-1 flex-col items-center " style={{ height: "600px", borderRadius: "10px", boxShadow: "-5px 5px 25px 5px RGBA( 220, 220, 220, 1 )" }}>
            <div className="p-3">
              <h1 className="text-black whitespace-nowrap text-center text-3xl font-medium">Register</h1>
              {error && <div className="auth__error">{error}</div>}
              <div className="flex items-center justify-center gap-4">
                <form onSubmit={requestOTP}>
                  <div className="mb-3">
                    <label className="form-label  text-black font-medium">Username</label>
                    <input
                      type="text"
                      className="form-control border-lighten bg-light text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                      value={displayName}
                      placeholder="Username"
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-black font-medium">Verification Method</label>
                    <select
                      className="form-select border-lighten bg-light text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                      value={verificationMethod}
                      onChange={(e) => setVerificationMethod(e.target.value as 'email' | 'phone')}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>
                  {verificationMethod === 'email' && (
                    <div className="mb-3">
                      <label className="form-label text-black font-medium">Email</label>
                      <input
                        type="email"
                        className="form-control border-lighten bg-light text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  )}
                  {verificationMethod === 'phone' && (
                    <div className="mb-3">
                      <label className="form-label text-black font-medium">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control border-lighten bg-light text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                        value={phoneNumber}
                        placeholder="Phone Number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label text-black font-medium">Password</label>
                    <input
                      type="password"
                      className="form-control border-lighten bg-light text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                      value={password}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-black font-medium">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control border-lighten bg-light text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-4">
                    <button
                      disabled={registering}
                      className="flex min-w-[200px] cursor-pointer items-center gap-3 rounded-md bg-white p-2 text-black transition duration-300 hover:brightness-90 disabled:!cursor-default disabled:!brightness-75"
                      type="submit"
                      style={{ color: "#FFFFFF", backgroundColor: "#0068FF" }}
                    >
                      Sign Up
                    </button>
                    <button
                      className="flex min-w-[200px] cursor-pointer items-center gap-3 rounded-md bg-white p-2 text-black transition duration-300 hover:brightness-90"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
              {expandForm && verificationMethod === 'email' && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div id="emailHelp" className="form-text text-dark mt-3 justify-center">
                    Email verification link sent! Check your email.
                  </div>
                </div>
              )}
              {expandForm && verificationMethod === 'phone' && (
                <div className="flex flex-col items-center justify-center gap-4">
                  <div id="phoneNumberHelp" className="form-text text-dark mt-3 justify-center">
                    Press Enter to confirm
                  </div>
                  <div className="mb-1 text-black">
                    <label htmlFor="otpInput" className="form-label text-black mr-3 font-medium">OTP :</label>
                    <input
                      type="text"
                      className="form-control border-lighten bg-light text-dark-lighten w-150 h-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                      id="otpInput"
                      value={OTP}
                      onChange={vertifyOTP}
                    />
                    Please enter OTP
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
