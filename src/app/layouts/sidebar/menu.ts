import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    
    {
        id: 11111,
        label: 'DeeperMind',
        isTitle: true
    },
    {
        id: 11,
        label: 'MENUITEMS.DASHBOARDS.TEXT',
        icon: 'bx-home-circle',
        link: '/dashboard',
    },
    {
        id: 12,
        label: 'MENUITEMS.FILEMANAGER.TEXT',
        icon: 'bx-file-find',
        link: '/filemanager',
    },
    {
        id: 13,
        label: 'Paramètres',
        icon: 'bx-wrench',
        link: '/settings',
    },
];

