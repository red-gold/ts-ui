import Collapse from '@mui/material/Collapse';
import StringAPI from 'api/StringAPI';
import classNames from 'classnames';
import { IReadMoreProps } from 'components/readMore/IReadMoreProps';
import { useState } from 'react';
import { log } from 'utils/log';

import { useStyles } from './readMoreStyles';

export default function ReadMoreComponent(props: IReadMoreProps) {
    const classes = useStyles();

    const [expanded, setExpanded] = useState(false);

    const toggleLines = (event: any) => {
        event.preventDefault();

        setExpanded(!expanded);
    };

    const { lines = 3, body, ...restProps } = props;

    if (lines === undefined) {
        log.error('render/undefineProps/lines');
        return <div />;
    }

    const readMoreElem = (
        <div onClick={toggleLines} className={classNames(classes.root, { [classes.expanded]: !expanded })}>
            <Collapse in={expanded} collapsedSize="173px">
                {(props as any).children}
            </Collapse>
        </div>
    );
    const numberOfLines = !StringAPI.isEmpty(body) ? StringAPI.getNumberOfLines(body) : 0;
    if (numberOfLines > lines) {
        return readMoreElem;
    }
    return (props as any).children;
}
