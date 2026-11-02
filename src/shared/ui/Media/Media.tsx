import { getMedia, toMediaView } from '@shared/lib/media';
import styles from './Media.module.css';

export type MediaProps = {
  /** An id from assets/media.json. */
  id: string;
};

export function Media({ id }: MediaProps) {
  const item = getMedia(id);
  if (!item) return null;

  const view = toMediaView(item);
  switch (view.kind) {
    case 'image':
      return (
        <figure className={styles.figure}>
          <img className={styles.image} src={view.src} alt={view.alt} loading="lazy" />
        </figure>
      );
    case 'video':
      return (
        <figure className={styles.figure}>
          <div className={styles.video}>
            <iframe
              className={styles.frame}
              src={view.embedUrl}
              title={view.title}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <figcaption className={styles.caption}>{view.title}</figcaption>
        </figure>
      );
    case 'card':
      return (
        <a className={styles.card} href={view.href} target="_blank" rel="noopener noreferrer">
          <span className={styles.label}>{view.label}</span>
          <span className={styles.title}>{view.title}</span>
          {view.source && <span className={styles.source}>{view.source}</span>}
          <span className={styles.visuallyHidden}> (opens in new tab)</span>
        </a>
      );
  }
}
