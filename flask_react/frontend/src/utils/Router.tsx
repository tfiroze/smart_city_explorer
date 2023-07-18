import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "../views/Dashboard";
import { Startup } from "../views/Startup";

interface RouterProps {
  auth: boolean;
}

export const Router: React.FC<RouterProps> = ({ auth }) => {
  return (
    <Routes>
      {auth ? (
        <>
          <Route path="/*" element={<Dashboard />} />
        </>
      ) : (
        <>
          <Route path="/*" element={<Startup />} />
        </>
      )}
    </Routes>
  );
};
