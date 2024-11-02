import { lazy } from "react";
import { Route, Routes } from "react-router-dom";

// Lazy loaded components
const IaPanel = lazy(() => import("@/pages/Builder/IaPanel"));
const ContextEntry = lazy(() => import("@/pages/Builder/ContextEntry"));
const DataEntry = lazy(() => import("@/pages/Builder/DataEntry"));
const WidgetCustomizer = lazy(() => import("@/pages/Builder/WidgetCustomizer"));
const Tools = lazy(() => import("@/pages/Builder/Tools"));

const AgentsDetailsModule = () => {
  return (
    <Routes>
      <Route path="/:aiTeamName/:aiTeamId" element={<IaPanel />} />
      <Route path="/contextEntry/:aiTeamId" element={<ContextEntry />} />
      <Route path="/dataEntry/:botId" element={<DataEntry />} />
      <Route path="/widgetCustomizer/:botId" element={<WidgetCustomizer />} />
      <Route path="/tools/:aiTeamId/:botName/:botId" element={<Tools />} />
    </Routes>
  );
};

export default AgentsDetailsModule; 