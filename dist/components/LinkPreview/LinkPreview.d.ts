import React from 'react';
import './linkPreview.scss';
export interface LinkPreviewProps {
    url: string;
    className?: string;
    width?: string | number;
    height?: string | number;
    descriptionLength?: number;
    borderRadius?: string | number;
    imageHeight?: string | number;
    textAlign?: 'left' | 'right' | 'center';
    margin?: string | number;
    fallback?: JSX.Element[] | JSX.Element | null;
    backgroundColor?: string;
    primaryTextColor?: string;
    secondaryTextColor?: string;
    borderColor?: string;
    showLoader?: boolean;
    customLoader?: JSX.Element[] | JSX.Element | null;
}
export interface APIResponse {
    title: string | null;
    description: string | null;
    image: string | null;
    siteName: string | null;
    hostname: string | null;
}
export declare const LinkPreview: React.FC<LinkPreviewProps>;
