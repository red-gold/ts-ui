import React from 'react';

export interface IReadMoreProps {
    classes?: any;
    lines?: number;
    more?: string;
    less?: string;
    body: string;
    children: React.ReactNode;
    currentLanguage?: string;
}
