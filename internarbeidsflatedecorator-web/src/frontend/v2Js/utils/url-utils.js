import queryString from 'query-string';

export const hentValgtEnhetIDFraURL = () => {
    const queries = queryString.parse(location.search);
    return queries.enhet;
};
