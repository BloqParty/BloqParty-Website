export default function getServerSideProps({ resolvedUrl, query }) {
    const props = { path: query.path };

    for(const key of Object.keys(props)) {
        delete query[key];
    };

    props.query = query;

    console.debug(`getServerSideProps: ${resolvedUrl} ->`, props);

    return { props }
}