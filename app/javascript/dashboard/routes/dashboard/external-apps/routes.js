import { frontendURL } from '../../../helper/URLHelper';
import ExternalAppView from './ExternalAppView.vue';

// URL fixa do sistema externo.
const EXTERNAL_APP_URL = 'https://dashboard-biomagistral.vercel.app/iframe-entry';

export const routes = [
  {
    path: frontendURL('accounts/:accountId/apps/dashboard'),
    name: 'external_app_dashboard',
    component: ExternalAppView,
    props: {
      appUrl: EXTERNAL_APP_URL,
      appName: 'Dashboard',
    },
    meta: {
      permissions: ['administrator', 'agent', 'custom_role'],
    },
  },
];
