import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Support } from '@app/Support/Support';
import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';
import { VirtualMachines } from '@app/VirtualMachines/VirtualMachines';
import { Pods } from '@app/Pods/Pods';

export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  element: React.ReactElement;
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label?: string; // Excluding the label will exclude the route group from the nav sidebar
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    element: <Pods />,
    exact: true,
    path: '/',
    title: 'PatternFly Seed | Pods',
  },
  {
    element: <VirtualMachines />,
    exact: true,
    label: 'Virtual machines',
    path: '/virtual-machines',
    title: 'PatternFly Seed | Virtual Machines',
  },
  {
    element: <Pods />,
    exact: true,
    label: 'Pods',
    path: '/pods',
    title: 'PatternFly Seed | Pods',
  },
  {
    element: <Support />,
    exact: true,
    path: '/support',
    title: 'PatternFly Seed | Support Page',
  },
  {
    routes: [
      {
        element: <GeneralSettings />,
        exact: true,
        label: 'General',
        path: '/settings/general',
        title: 'PatternFly Seed | General Settings',
      },
      {
        element: <ProfileSettings />,
        exact: true,
        label: 'Profile',
        path: '/settings/profile',
        title: 'PatternFly Seed | Profile Settings',
      },
    ],
  },
];

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [...flattened, ...(route.routes ? route.routes : [route])],
  [] as IAppRoute[],
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {flattenedRoutes.map(({ path, element }, idx) => (
      <Route path={path} element={element} key={idx} />
    ))}
    <Route element={<NotFound />} />
  </Routes>
);

export { AppRoutes, routes };
