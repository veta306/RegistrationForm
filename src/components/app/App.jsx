import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RegisterForm from "../RegisterForm/RegisterForm";
import ProfileForm from "../ProfileForm/ProfileForm";
import Cross from "../../assets/Icon.png";
import Logo from "../../assets/Logo.png";
import { getAllStates, getDialCodes } from "../../utils/functions";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RegisterForm />,
      loader: async () => {
        return await getDialCodes();
      },
    },
    {
      path: "/profile",
      element: <ProfileForm />,
      loader: async () => {
        return await getAllStates();
      },
    },
  ]);
  return (
    <>
      <div className="flex w-44 h-6">
        <img className="mr-3" src={Logo} alt="logo" />
        <div className="text-base font-bold">COMPANY NAME</div>
      </div>
      <RouterProvider router={router} />
      <div className="w-12 h-12">
        <img src={Cross} alt="cross" />
      </div>
    </>
  );
}

export default App;
