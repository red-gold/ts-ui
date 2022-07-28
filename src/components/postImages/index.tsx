// Copyright (c) 2021 Amirhossein Movahedi (@qolzam)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import Img from 'components/img';
import SvgRemoveImage from '@mui/icons-material/RemoveCircle';
import SvgPlay from '@mui/icons-material/PlayCircleFilled';
import classNames from 'classnames';
import { PostType } from 'core/domain/posts/postType';
import { useStyles } from './postImagesStyles';
import { IPostImagesProps } from './IPostImagesProps';

export default function PostImages({ onRemoveImage, postType, image, thumbnail }: IPostImagesProps) {
    const classes = useStyles();
    return (
        <>
            <div style={{ position: 'relative', overflowY: 'hidden', overflowX: 'auto' }}>
                <ul
                    style={{
                        position: 'relative',
                        whiteSpace: 'nowrap',
                        padding: '0 0 0 16px',
                        margin: '8px 0 0 0',
                        paddingRight: '16px',
                        verticalAlign: 'bottom',
                        flexShrink: 0,
                        listStyleType: 'none',
                    }}
                >
                    <div style={{ display: 'flex', position: 'relative' }}>
                        <span
                            onClick={onRemoveImage}
                            style={{
                                position: 'absolute',
                                width: '28px',
                                backgroundColor: 'rgba(6, 6, 6, 0.82)',
                                height: '28px',
                                right: 12,
                                top: 4,
                                cursor: 'pointer',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <SvgRemoveImage style={{ color: 'rgba(239, 235, 235, 0.83)' }} />
                        </span>
                        <span
                            className={classNames(classes.playVideo, {
                                [classes.noDisplay]: postType !== PostType.Video,
                            })}
                            style={{}}
                        >
                            <SvgPlay sx={{ fontSize: '50px' }} />
                        </span>

                        <div
                            style={{
                                display: 'inline-block',
                                width: '100%',
                                marginRight: '8px',
                                transition: 'transform .25s',
                            }}
                        >
                            <li
                                style={{
                                    width: '100%',
                                    margin: 0,
                                    verticalAlign: 'bottom',
                                    position: 'static',
                                }}
                            >
                                <Img
                                    fileName={postType === PostType.Photo ? image : thumbnail}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </li>
                        </div>
                    </div>
                </ul>
            </div>
        </>
    );
}
