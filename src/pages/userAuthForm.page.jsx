import { Link } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";
import { useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();

  const userAuthThroughServer = ({ serverRoute, formData }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        console.log(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
        
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    // Regex
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    // FormaData
    let form = new FormData(authForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be atleast 3 characters long");
      }
    }

    if (!email.length) {
      return toast.error("Email is required");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must contain atleast 1 uppercase, 1 lowercase, 1 number and must be 6-20 characters long"
      );
    }

    userAuthThroughServer(serverRoute, formData);
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form ref={authForm} className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome Back" : "Jions Us Today"}
          </h1>
          {type !== "sign-in" ? (
            <InputBox
              name={"fullname"}
              type={"text"}
              placeholder={"Full Name"}
              icon={"fi-rr-user"}
            />
          ) : (
            ""
          )}
          <InputBox
            name={"email"}
            type={"email"}
            placeholder={"Email"}
            icon={"fi-rr-at"}
          />
          <InputBox
            name={"password"}
            type={"password"}
            placeholder={"Password"}
            icon={"fi-rr-key"}
          />
          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>Or</p>
            <hr className="w-1/2 border-black" />
          </div>
          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={googleIcon} className="w-5" />
            Continue with Google
          </button>
          {type == "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't Have an Account
              <Link
                to={"/signup"}
                className="underline text-black text-xl ml-1"
              >
                Jion Us Today?
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a Member?
              <Link
                to={"/signin"}
                className="underline text-black text-xl ml-1"
              >
                Sign In
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
