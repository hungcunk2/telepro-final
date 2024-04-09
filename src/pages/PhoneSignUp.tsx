import { FC, FormEvent, useState } from "react";
import { auth } from "../shared/firebase";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

interface PhoneProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

const PhoneSignUp: FC<PhoneProps> = ({ isOpened, setIsOpened }) => {
  const countryCode = "+84";
  const [phoneNumber, setPhoneNumber] = useState(countryCode);
  const [expandForm, setExpandForm] = useState(false);
  const [OTP, setOTP] = useState("");

  const generateRecapcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recapchar-container",
      {
        size: "invisible",
        callback: (response: string) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          //   onSignInSubmit();
        },
      },
      auth
    );
  };
  const requestOTP = (e: FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 12) {
      setExpandForm(true);
      generateRecapcha();
      let appVertifier = window.recaptchaVerifier;
      signInWithPhoneNumber(auth, phoneNumber, appVertifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const vertifyOTP = (e: any) => {
    let otp = e.target.value;
    setOTP(otp);
    if (otp.length === 6) {
      //  window.confirmationResult = confirmationResult;
      window.confirmationResult
        .confirm(otp)
        .then((result: any) => {
          const users = result.user;
        })
        .catch((error: any) => {
          // console.log(error);
        });
    }
  };

  return (
    <div
      onClick={() => setIsOpened(false)}
      className={`fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080] transition-all duration-300 ${
        isOpened ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-light-blue mx-2 w-full max-w-[550px] rounded-lg"
      >
        <div className="border-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1"></div>
          <div className="flex flex-1 items-center justify-center">
            <h1 className="text-dark whitespace-nowrap text-center text-3xl font-medium">
              Sign in with phone number
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => setIsOpened(false)}
              className="bg-light-blue flex h-8 w-8 items-center justify-center rounded-full"
            >
              <i className="bx bx-x text-dark text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-center justify-center gap-4">
            <form onSubmit={requestOTP}>
              <div className="mb-3">
                <label
                  htmlFor="phoneNumberInput"
                  className="form-label text-dark-lighten text-base font-medium"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control border-lighten bg-light text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                  id="phoneNumberInput"
                  aria-describedby="emailHelp"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+84"
                />
              </div>
            </form>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              id="phoneNumberHelp"
              className="form-text text-dark mt-3 justify-center"
            >
              Press Enter to confirm
            </div>
            {expandForm === true ? (
              <>
                <div className="mb-1">
                  <label
                    htmlFor="otpInput"
                    className="form-label text-dark mr-3 font-medium "
                  >
                    OTP :
                  </label>
                  <input
                    type=""
                    className="form-control border-lighten bg-light text-dark-lighten w-150 h-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
                    id="otpInput"
                    value={OTP}
                    onChange={vertifyOTP}
                  ></input>
                </div>
                <div id="otpHelp" className="form-text text-dark">
                  Please enter PIN
                </div>
              </>
            ) : null}
            {expandForm === false ? <div></div> : null}
            <div id="recapchar-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PhoneSignUp;
