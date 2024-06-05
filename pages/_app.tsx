import { AppProps } from 'next/app';
import './index.css'; // Adjust the path to where your index.css is located

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default App;