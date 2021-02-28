export class Album {
    constructor(
        public photos: string[] = [],
        public cover: string = '',
        public coverId: string = '00000000-0000-0000-0000-000000000000',
        public count: number = 0,
        public title: string = '',
    ) {}
}
