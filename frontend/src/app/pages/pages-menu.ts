import { NbMenuItem } from '@nebular/theme';
import { AUTHCONFIG } from '../auth/auth-cfg';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'PUBLIC FEATURES',
    group: true,
  },
  {
    title: 'Jobs',
    icon: 'layers-outline',
    link: '/pages/jobs',
    home: true,
  },
  {
    title: 'Job Instances',
    icon: 'calendar-outline',
    link: '/pages/job-instances',
  },
  {
    title: 'GUARDED FEATURES',
    group: true,
    data: { roles: AUTHCONFIG.users },
  },
  {
    title: 'Users',
    icon: 'people-outline',
    link: '/pages/users',
    data: { roles: AUTHCONFIG.users },
  },
];
