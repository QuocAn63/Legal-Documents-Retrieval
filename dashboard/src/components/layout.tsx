import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

const DefaultLayout = () => {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2">
        <Sidebar />
      </div>
      <div className="col-span-10 px-5">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
