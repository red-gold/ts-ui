import { createStyles, makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(() =>
    createStyles({
        textField: {
            fontWeight: 400,
            fontSize: '14px',
        },
        commentBody: {
            color: 'black',
            fontWeight: 400,
            fontSize: '12px',
            height: '100%',
            border: 'none',
            width: '100%',
            outline: 'none',
            resize: 'none',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        },
        author: {
            fontSize: '10px',
            paddingRight: '10px',
            fontWeight: 400,
            color: 'rgba(0,0,0,0.87)',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
        },
        noUnderline: {
            display: 'none',
        },
        cardHeaderContent: {
            flex: '1 1 auto',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
        },
        commentItem: {
            height: '60px',
        },
        toggleShowList: {
            height: '60px',
            zIndex: 5,
        },
        writeCommentTextField: {
            width: '100%',
            fontWeight: 400,
            fontSize: '14px',
        },
    }),
);
