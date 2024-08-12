import { Link } from '@navikt/ds-react';
import React from 'react';
import { LinkSection, LinkSections, LinkWithTitle } from './useGenerateLinks';
import useGlobalHandlers from '../../store/GlobalHandlers';

export const DecoratorLinks: React.FC<LinkSections> = (links) => {
  return (
    <div className="dr-max-w-6xl dr-mr-auto dr-ml-auto dr-p-4 dr-text-left">
      <div className="dr-flex dr-flex-wrap dr-mb-8">
        <Column linkSection={links.modia} />
        <Column linkSection={links.arbeidsrettet} />
        <Column linkSection={links.sykefravaer} />
      </div>
      <Row linkSection={links.andre} />
    </div>
  );
};

export const FullScreenLinks: React.FC<LinkSections> = (links) => {
  return (
    <div className="dr-max-w-6xl dr-mr-auto dr-ml-auto dr-p-8 dr-text-left dr-grid dr-grid-cols-1 sm:dr-grid-cols-3 dr-gap-y-8">
      <Column linkSection={links.modia} />
      <Column linkSection={links.arbeidsrettet} />
      <Column linkSection={links.sykefravaer} />
      <div className="sm:dr-col-span-3">
        <Row linkSection={links.andre} />
      </div>
    </div>
  );
};

const Column: React.FC<{ linkSection: LinkSection }> = ({ linkSection }) => {
  return (
    <section className="dr-min-w-[25%] dr-px-6">
      <h2 className="dr-font-bold dr-border-white dr-border-solid dr-border-b dr-mb-2 dr-pb-1">
        {linkSection.title}
      </h2>
      <ul>
        {linkSection.links.map((link: LinkWithTitle) => {
          const href = `${link.url}${link.subPath}`;
          return (
            <LinkComponent
              key={href}
              href={href}
              newPage={linkSection.newPage}
              linkText={link.title}
            />
          );
        })}
      </ul>
    </section>
  );
};

const Row: React.FC<{ linkSection: LinkSection }> = ({ linkSection }) => {
  return (
    <section className="dr-px-6">
      <h2 className="dr-font-bold dr-border-white dr-border-solid dr-border-b dr-mb-2">
        {linkSection.title}
      </h2>
      <ul className="dr-flex dr-flex-wrap dr-gap-x-8">
        {linkSection.links.map((link: LinkWithTitle) => {
          const href = `${link.url}${link.subPath}`;
          return (
            <LinkComponent
              key={href}
              href={href}
              newPage={linkSection.newPage}
              linkText={link.title}
              target={link.target}
            />
          );
        })}
      </ul>
    </section>
  );
};

const LinkComponent: React.FC<{
  href: string;
  newPage?: boolean | undefined;
  linkText: string;
  target?: string | undefined;
}> = ({ href, linkText, newPage = false, target }) => {
  const onLinkClick = useGlobalHandlers((state) => state.onLinkClick);

  const onClick = () => {
    onLinkClick?.(linkText, href);
  };

  return (
    <li className="dr-block dr-text-white dr-py-1">
      <Link
        href={href}
        rel={target ? '' : 'nooppener noreferrer'}
        target={target ?? (newPage ? '_blank' : '_self')}
        className="!dr-block !dr-text-white !dr-py-1 !dr-no-underline focus:!dr-outline-none focus:!dr-ring focus:!dr-ring-orange-400 focus:!dr-bg-transparent hover:!dr-text-orange-400 hover:before:!dr-w-2 hover:before:!dr-h-2 hover:before:!-dr-mr-2 hover:before:!dr-bg-orange-400 hover:before:!dr-rounded-full hover:before:!dr-inline-block hover:before:!-dr-left-4 hover:before:!dr-relative hover:before:!dr-mb-[2px] hover:visited:!dr-text-orange-400"
        onClick={onClick}
      >
        {linkText}
      </Link>
    </li>
  );
};
