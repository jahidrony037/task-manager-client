import { Outlet } from "react-router";
const AuthLayout = () => {
  return (
    <div>
      <div className="hero bg-base-200">
        <div className="">
          {/* <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
          </div> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
