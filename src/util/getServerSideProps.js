export default function getServerSideProps({ params, query }) {
    return {
        props: {
            apiLocation: query.bpApiLocation,
            query
        }
    }
}