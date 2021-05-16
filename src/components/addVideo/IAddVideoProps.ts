export interface IAddVideoProps {
    /**
     * Whether add video modal is open
     */
    open: boolean;

    /**
     * Handle close add video modal
     */
    onClose: any;

    /**
     * On Add vido link
     */
    onAddLink: (url: string, thumbnail: string) => void;
}
