import * as React from 'react';
import { ISharePointUser } from '../models';
import { useServiceContext } from './ServiceContext';

export interface IUserContextValue {
  user: ISharePointUser | undefined;
  groups: string[];
  isAdmin: boolean;
  isContributor: boolean; // true for Admins too — Admin implies Contributor rights
  loading: boolean;
}

const UserContext = React.createContext<IUserContextValue | undefined>(undefined);

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { service, config } = useServiceContext();
  const [state, setState] = React.useState<{ user?: ISharePointUser; groups: string[] }>({ groups: [] });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([service.getCurrentUser(), service.getCurrentUserGroups()])
      .then(([user, groups]) => { if (!cancelled) setState({ user, groups }); })
      .catch(() => { if (!cancelled) setState({ groups: [] }); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [service]);

  const isAdmin = state.groups.indexOf(config.groups.admins) !== -1;
  const isContributor = isAdmin || state.groups.indexOf(config.groups.contributors) !== -1;

  const value: IUserContextValue = { user: state.user, groups: state.groups, isAdmin, isContributor, loading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUserContext(): IUserContextValue {
  const ctx = React.useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used within a UserContextProvider');
  return ctx;
}
