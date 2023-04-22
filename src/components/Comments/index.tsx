import styles from './styles.module.scss';

export function Comments(): JSX.Element {
  return (
    <section
      className={styles.container}
      ref={element => {
        if (!element) return;

        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', 'https://utteranc.es/client.js');
        scriptElement.setAttribute('repo', 'fredowisk/spacetraveling');
        scriptElement.setAttribute('issue-term', 'title');
        scriptElement.setAttribute('theme', 'github-dark');
        scriptElement.setAttribute('crossorigin', 'anonymous');
        scriptElement.setAttribute('async', 'true');
        element.replaceWith(scriptElement);
      }}
    />
  );
}
