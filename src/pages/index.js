import Head from 'next/head';
import LeftSide from '../components/LeftSide';
import SignUp from '../components/SignUp';

import styles from '../styles/pages/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bemvindol | Cadastro </title>
      </Head>
      <section>
        <div>
          <LeftSide />
        </div>
        <div>
          <SignUp />
        </div>
      </section>
    </div>
  );
}
