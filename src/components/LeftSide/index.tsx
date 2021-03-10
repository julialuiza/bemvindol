import { ReactNode } from 'react';
import styles from '../../styles/components/LeftSide.module.css';

interface LeftSideProps {
  children: ReactNode;
}

function LeftSide({ children }: LeftSideProps) {
  return (
    <>
    <div className={styles.containerLeftSide}>
      <div className={styles.containerBemVindo}>
        <h1>Bem vindo(a)!</h1>
      </div>
      <div className={styles.containerLogo}>
        <img src="/imgs/bemol-logo.png" alt="logo da bemol" width="108px" height="58px" />
        <span>Escolha com confiança</span>
      </div>
    </div>
    </>
  );
}

export default LeftSide;
