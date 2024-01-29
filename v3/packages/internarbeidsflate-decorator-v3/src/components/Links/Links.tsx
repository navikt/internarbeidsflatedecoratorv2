import { Link } from '@navikt/ds-react';
import React, { PropsWithChildren, useMemo } from 'react';
import { useAppState } from '../../states/AppState';
import { LinkSection, LinkSections, generateLinks } from './generateLinks';
import StoreHandler from '../../store/StoreHandler';

const Links: React.FC = () => {
  const { fnr, enhet } = StoreHandler.store((state) => ({
    fnr: state.fnr.value,
    enhet: state.enhet.value,
  }));
  const { environment, urlFormat } = useAppState((state) => ({
    environment: state.environment,
    urlFormat: state.urlFormat,
  }));

  const links = useMemo((): LinkSections => {
    return generateLinks({ environment, enhet, fnr, urlFormat, aktoerId: '' });
  }, [enhet, environment, fnr, urlFormat]);

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

export default Links;

const Column: React.FC<{ linkSection: LinkSection }> = ({ linkSection }) => {
  return (
    <section className="dr-min-w-[25%] dr-px-6">
      <h2 className="dr-font-bold dr-border-white dr-border-solid dr-border-b dr-mb-2">
        {linkSection.title}
      </h2>
      <ul>
        {linkSection.links.map((link) => {
          const href = `${link.url}${link.subPath}`;
          return (
            <LinkComponent key={href} href={href} newPage={linkSection.newPage}>
              {link.title}
            </LinkComponent>
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
        {linkSection.links.map((link) => {
          const href = `${link.url}${link.subPath}`;
          return (
            <LinkComponent key={href} href={href} newPage={linkSection.newPage}>
              {link.title}
            </LinkComponent>
          );
        })}
      </ul>
    </section>
  );
};

const LinkComponent: React.FC<
  PropsWithChildren & { href: string; newPage?: boolean | undefined }
> = ({ href, children, newPage = false }) => {
  return (
    <li className="dr-block dr-text-white dr-py-1">
      <Link
        href={href}
        rel="nooppener noreferrer"
        target={newPage ? '_blank' : '_self'}
        className="dr-block dr-text-white dr-py-1 dr-no-underline focus:dr-outline-none focus:dr-ring focus:dr-ring-orange-400 focus:dr-bg-transparent hover:dr-text-orange-400 hover:before:dr-w-2 hover:before:dr-h-2 hover:before:-dr-mr-2 hover:before:dr-bg-orange-400 hover:before:dr-rounded-full hover:before:dr-inline-block hover:before:-dr-left-4 hover:before:dr-relative hover:before:dr-mb-[2px] hover:visited:dr-text-orange-400"
        children={children}
      />
    </li>
  );
};
