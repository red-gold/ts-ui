
export const callSnackStyles = (theme: any) => ({
    paper: theme.mixins.gutters({
        maxWith: 900,
        minWidth: 346,
        margin: '30px auto',
        padding: 20,
    }),
    disableComponent: {
        opacity:'0.2',  
        'pointer-events': 'none'
    }
})