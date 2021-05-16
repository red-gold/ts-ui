export interface IHomeHeaderProps {
    /**
     * Sidebar is open {true} or not {false}
     */
    drawerStatus: boolean;

    /**
     * Toggle sidebar
     */
    onToggleDrawer: () => void;

    /**
     * Toggle messenger window
     */
    onToggleMessenger: () => void;
}
