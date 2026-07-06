import type { NavItem } from '@/types/configuration.type'

// config/navigation.ts
import {
  DashboardSquare1,
  Globe2,
  Locked3,
  UserMultiple1,
  Gear1,
  Book4,
  FileTextMultiple
} from '@tailgrids/icons'

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Vue d'ensemble",
    children: [{ label: 'Tableau de Bord', icon: DashboardSquare1, path: '/' }]
  },

  {
    label: 'Réseau',
    children: [
      {
        label: 'Servers',
        path: '/network/servers',
        icon: Globe2
      },
      {
        label: 'Tokens',
        path: '/network/tokens',
        icon: Locked3
      },
      {
        label: 'Règles',
        path: '/network/rule',
        icon: Book4
      },
      {
        label: 'Journaux',
        path: '/network/logs',
        icon: FileTextMultiple
      }
    ]
  },
  {
    label: 'Equipe',
    children: [
      {
        label: 'Utilisateurs',
        path: '/team/users',
        icon: UserMultiple1
      },
      {
        label: 'Configuration',
        path: '/team/configuration',
        icon: Gear1
      }
    ]
  },
  {
    label: 'Compte',
    children: [
      {
        label: 'Paramètres',
        path: '/account/settings',
        icon: Gear1
      }
    ]
  }
]
