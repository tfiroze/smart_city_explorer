import { Navigate, Route, Routes } from "react-router-dom"
import { Dashboard } from "../views/Dashboard"
import { Questionnaire } from "../views/Questionnaire"
import { Startup } from "../views/Startup"

interface RouterProps {
    auth: boolean;
  }
  
  export const Router: React.FC<RouterProps> = ({ auth }) => {
    return (
        <Routes>
            {auth ? (
                <>
                    <Route path="/" element={<Navigate to="/dashboard" />}  />
                    <Route path="/questionnaire" element={<Questionnaire />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<Startup />} />
                </>


            )}
        </Routes>
    )
}