import { useTheme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

export function LoadMoreProgressComponent() {
    const theme = useTheme();
    return (
        <div key="load-more-progress" className="g-load-more">
            <CircularProgress size={30} thickness={5} style={{ color: theme.palette.primary.light }} />
        </div>
    );
}

export default LoadMoreProgressComponent;
