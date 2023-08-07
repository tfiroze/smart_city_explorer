import { Route, Routes } from "react-router-dom";
// import { Header } from "../components/dashboard/Header"; // Path to your Header component
// import SliderNav from "../components/navigation/SliderNav"; // Path to your ProfileDrawer component
import { Dashboard } from "../views/Dashboard";
import { Startup } from "../views/Startup";
import ChoroplethMap from "../views/MapTest";
import { CreateItinerary } from "../views/CreateItinerary";
import { ItineraryDetails } from "../views/ItienaryDetails";
import { ErrorPage } from "../views/ErrorPage";
import Profile from "../components/profile/Profile";
import { useState } from "react";
import EditProfile from "../views/EditProfile";

interface RouterProps {
  auth: boolean;
}

export const Router: React.FC<RouterProps> = ({ auth }) => {
  const [profileDrawerOpen, setProfileDrawerOpen] = useState<boolean>(false);

  return (
    <>
      {/* <Header setProfileDrawerOpen={setProfileDrawerOpen} /> */}
      {/* <SliderNav /> */}
      <Routes>
        {auth ? (
          <>
            <Route path="/*" element={<Dashboard />} />
            <Route path="/createItinerary" element={<CreateItinerary />} />
            <Route path="/EditProfile" element={<EditProfile />} />
          </>
        ) : (
          <>
            <Route path="/*" element={<Startup />} />
          </>
        )}
        </Routes>
    </>
  );
};
