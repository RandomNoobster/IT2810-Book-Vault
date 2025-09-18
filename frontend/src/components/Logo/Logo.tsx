import { SVGProps } from 'react';
import { Group, GroupProps, Image, ImageProps } from '@mantine/core';
import BookVaultLogo from '../../assets/BookVaultLogo.png';
import BookVaultLogoWebP from '../../assets/BookVaultLogo.webp';
import BookVaultTextImage from '../../assets/BookVaultText.svg';
import BookVaultText from '../../assets/BookVaultText.svg?react';
import styles from './Logo.module.css';

/** Returns the full logo with icon and text */
export const LogoFull = (props: GroupProps) => {
  return (
    <>
      <Group
        component="figure"
        {...props}
        className={`${styles.wrapper} ${props.className ?? ''}`}
        aria-label="Logo"
      >
        <LogoIcon />
        <LogoText />
      </Group>
    </>
  );
};

/** Returns the logo icon as a webp image, with a fallback to png */
export const LogoIcon = (props: ImageProps) => {
  return (
    <Image src={BookVaultLogoWebP} alt="Book Logo Icon" fallbackSrc={BookVaultLogo} {...props} />
  );
};

/** Returns the logo text as Vite SVG using svgr, faster to load compared to image. Is not highlightable */
export const LogoText = (props: SVGProps<SVGSVGElement>) => {
  return <BookVaultText title="The Book Vault" {...props} />;
};

/** Return the logo text as an image. This is useful if you want the text to be highlightable */
export const LogoTextImage = (props: ImageProps) => {
  return <Image src={BookVaultTextImage} alt="The Book Vault" {...props} />;
};
