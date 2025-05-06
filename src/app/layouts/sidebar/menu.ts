import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
    
    {
        id: 11111,
        label: 'DeeperMind',
        isTitle: true
    },
    {
        id: 11,
        label: 'MENUITEMS.DASHBOARD.TEXT',
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
        label: 'MENUITEMS.SETTINGS.TEXT',
        icon: 'bx-wrench',
        link: '/settings',
    },
    {
        id: 14,
        label: 'MENUITEMS.HOWTO.TEXT',
        icon: 'bx-help-circle',
        link: '/howto',
    },
    {
        id: 15,
        label: 'MENUITEMS.FEEDBACK.TEXT',
        icon: 'bx-message',
        link: '/feedback',
    },
    /**{
        id: 16,
        label: 'MENUITEMS.FEEDBACK.TEXT',
        icon: 'bx-message',
        link: '/feedback',
    },*/
];

