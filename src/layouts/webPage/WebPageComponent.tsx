import React, { Component } from 'react';

// - Material UI
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Slide from '@material-ui/core/Slide';
import Backdrop, { BackdropProps } from '@material-ui/core/Backdrop';
import { TransitionProps } from '@material-ui/core/transitions';

import { webPageStyles } from './webPageStyles';
import { IWebPageProps } from './IWebPageProps';
import { IWebPageState } from './IWebPageState';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export class BackDropIOSWorkaround extends React.PureComponent<BackdropProps> {
    protected onTouchMove(event: React.TouchEvent<HTMLDivElement>): void {
        alert('hello');
        event.preventDefault();
    }

    public render(): JSX.Element {
        return <Backdrop {...this.props} onTouchMove={this.onTouchMove} />;
    }
}

export class WebPageComponent extends Component<IWebPageProps, IWebPageState> {
    /**
     * Fields
     */
    iframeRef: React.RefObject<HTMLIFrameElement>;
    targetElement: any = null;

    /**
     * Component constructor
     */
    constructor(props: IWebPageProps) {
        super(props);
        this.iframeRef = React.createRef();
        // Defaul state

        // Binding functions to `this`
    }

    /**
     * Handle load iframe
     */
    onLoad() {
        alert('loaded');
    }

    componentDidUpdate() {
        if (this.props.open) {
        } else {
        }
    }

    /**
     * Reneder component DOM
     */
    render() {
        const { classes, title, onClose, open, url } = this.props;

        return (
            <Dialog id={'ios-modal'} fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
                <AppBar color="secondary" className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" onClick={onClose} aria-label="Close">
                            <VpnKeyIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            {title}
                        </Typography>
                        <IconButton color="inherit" onClick={onClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <div className={classes.iosDialog}>
                    {url ? (
                        <iframe ref={this.iframeRef} src={url} width="100%" height="100%" frameBorder="0"></iframe>
                    ) : (
                        ''
                    )}
                </div>
            </Dialog>
        );
    }
}

// - Connect component to redux store
export default withStyles(webPageStyles as any)(WebPageComponent as any);
