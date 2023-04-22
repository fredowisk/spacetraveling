import { ActiveLink } from '../ActiveLink';
import styles from './styles.module.scss';

export function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink href="/">
          <img src="/images/logo.svg" alt="logo" />
        </ActiveLink>
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            Home
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            Posts
          </ActiveLink>
        </nav>
      </div>
    </header>
  );
}
