import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { initializeIcons } from '@fluentui/react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ServiceProvider } from '../../../../state/ServiceContext';
import { ThemeContextProvider } from '../../../../state/ThemeContext';
import { UserContextProvider } from '../../../../state/UserContext';
import { Layout } from '../Layout/Layout';
import {
  HomePage, HomeAlternatePage, PoliciesPage, SapConcurPage, LeisureTravelPage, CateringPage,
  MeetingsEventsPage, TravelCarePage, VisaSupportPage, SustainabilityPage, WellnessPage, TravelDashboardPage
} from '../pages';

initializeIcons();

export interface IAppProps {
  context: WebPartContext;
}

/**
 * Deliberately ONE SPFx web part rendering a client-routed SPA (HashRouter)
 * across every public page, rather than twelve separate web parts/pages —
 * simpler to deploy (add once to one modern page), and every page still
 * gets its own component under components/pages/ + its own route + its own
 * breadcrumb, so the "each page is one component" structure is intact.
 * See docs/ARCHITECTURE.md for how to add a 13th page.
 */
export const App: React.FC<IAppProps> = ({ context }) => (
  <ServiceProvider context={context}>
    <ThemeContextProvider>
      <UserContextProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/home-alternate" element={<HomeAlternatePage />} />
              <Route path="/leisure-travel" element={<LeisureTravelPage />} />
              <Route path="/wellness" element={<WellnessPage />} />
              <Route path="/sap-concur" element={<SapConcurPage />} />
              <Route path="/meetings-events" element={<MeetingsEventsPage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/travel-care" element={<TravelCarePage />} />
              <Route path="/sustainability" element={<SustainabilityPage />} />
              <Route path="/catering" element={<CateringPage />} />
              <Route path="/visa-support" element={<VisaSupportPage />} />
              <Route path="/dashboard" element={<TravelDashboardPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </UserContextProvider>
    </ThemeContextProvider>
  </ServiceProvider>
);
