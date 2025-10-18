import { useEffect } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Admin = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    if (user?.role !== "VENDEDOR") {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <>
      <Outlet />
    </>
  );
};

export default Admin;
