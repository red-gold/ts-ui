
import withStyles from '@material-ui/core/styles/withStyles';
import queryString from 'query-string';
import React, { Component } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { connectPhotoAlbum } from './connectPhotoAlbum';
import { IPhotoAlbumProps } from './IPhotoAlbumProps';
import { IPhotoAlbumState } from './IPhotoAlbumState';
import { photoAlbumStyles } from './photoAlbumStyles';

export class PhotoAlbumComponent extends Component<IPhotoAlbumProps & WithTranslation, IPhotoAlbumState> {
    /**
     * Fields
     */
    unlisten: any;
    currentPage = 0;

    constructor(props: IPhotoAlbumProps & WithTranslation) {
        super(props);

        // Defaul state
        this.state = {};

        // Binding functions to `this`
        this.searchQuery = this.searchQuery.bind(this);
        this.executeSearch = this.executeSearch.bind(this);
        this.searchParam = this.searchParam.bind(this);
    }

    searchQuery() {
        const { location } = this.props;
        this.executeSearch(location);
    }

    executeSearch(location: any) {
        const { search } = this.props;
        const params: { q: string } = queryString.parse(location.search) as any;

        search(params.q, this.currentPage, 10);
        this.currentPage++;
    }

    searchParam = () => {
        const params: { q: string } = queryString.parse(window.location.search) as any;
        return params.q;
    };

    componentDidMount() {
        const { history } = this.props;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const scope = this;
        this.unlisten = history.listen((location: any) => {
            scope.currentPage = 0;
            this.executeSearch(location);
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        return <div></div>;
    }
}

// - Connect component to redux store
const translateWrapper = withTranslation('translations')(PhotoAlbumComponent);

export default connectPhotoAlbum(withStyles(photoAlbumStyles as any)(translateWrapper) as any);
