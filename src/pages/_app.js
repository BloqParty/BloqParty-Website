import '../styles/global.css'
import '@fontsource/alata/index.css'

import Navbar from '../components/navbar'

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <Navbar />
            <div style={{ height: new Navbar().height, marginTop: `35px` }} />
            <Component { ...pageProps } />
        </>
    )
}