import { Outlet } from "react-router-dom";
import UserContextProvider from "../context/UserContext";
import { DeviceProvider } from "../context/DeviceContext";

const Root = () => {
  return (
    <DeviceProvider>
      <UserContextProvider>
        <Outlet />
      </UserContextProvider>
    </DeviceProvider>
  );
};

export default Root;
