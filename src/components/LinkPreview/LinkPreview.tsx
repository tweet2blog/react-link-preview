import React, { useEffect, useRef, useState } from 'react';

import './linkPreview.scss';
import Skeleton from './Skeleton';

const proxyLink = 'https://rlp-proxy.herokuapp.com/v2?url=';

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

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  url,
  className = '',
  width,
  height,
  descriptionLength,
  borderRadius,
  imageHeight,
  textAlign,
  margin,
  fallback = null,
  backgroundColor = 'white',
  primaryTextColor = 'black',
  secondaryTextColor = 'rgb(100, 100, 100)',
  borderColor = '#ccc',
  showLoader = true,
  customLoader = null,
}) => {
  const _isMounted = useRef(true);
  const [metadata, setMetadata] = useState<APIResponse | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    _isMounted.current = true;
    setLoading(true);
    fetch(proxyLink + url)
      .then((res) => res.json())
      .then((res) => {
        const meta: APIResponse = res.metadata;
        if (_isMounted.current) {
          if (!!meta.image?.match(/https?:\/\//)) {
            const url_ = new URL(meta.image as string, url);
            meta.image = url_.href;
          }
          if (meta.image == "https://rlp-proxy.herokuapp.com/img-placeholder.jpg") {
            meta.image = null
          };
          console.log(meta)
          setMetadata(meta);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        console.error(err);
        console.error('No metadata could be found for the given URL.');
        if (_isMounted.current) {
          setMetadata(null);
          setLoading(false);
        }
      });

    return () => {
      _isMounted.current = false;
    };
  }, [url]);

  if (loading && showLoader) {
    if (customLoader) {
      return <>{customLoader}</>;
    } else {
      return <Skeleton width={width} imageHeight={imageHeight} margin={margin} />;
    }
  }

  if (!metadata) {
    return <>{fallback}</>;
  }
  
  const { image, description, title, siteName, hostname } = metadata;

  const onClick = () => {
    window.open(url, '_blank');
  };

  console.log(image);

  return (
    <div
      data-testid='container'
      onClick={onClick}
      className={`Container ${className}`}
      style={{ width, height, borderRadius, textAlign, margin, backgroundColor, borderColor }}
    >
      {image && (
        <div
        data-testid='image-container'
        style={{
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
          backgroundImage: `url(${image})`,
          height: imageHeight,
        }}
        className='Image'
      ></div>
      )}
      <div className='LowerContainer'>
        <h3 data-testid='title' className='Title' style={{ color: primaryTextColor }}>
          {title}
        </h3>
        {description && (
          <span
            data-testid='desc'
            className='Description Secondary'
            style={{ color: secondaryTextColor }}
          >
            {descriptionLength
              ? description.length > descriptionLength
                ? description.slice(0, descriptionLength) + '...'
                : description
              : description}
          </span>
        )}
        <div className='Secondary SiteDetails' style={{ color: secondaryTextColor }}>
          {siteName && <span>{siteName} • </span>}
          <span>{hostname}</span>
        </div>
      </div>
    </div>
  );
};
