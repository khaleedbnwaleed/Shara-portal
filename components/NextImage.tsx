// Utility wrapper around Next.js image component that applies
// a basePath (useful for deployments under a sub‑path such as
// GitHub Pages) and disables the built‑in optimizer so that the
// component degrades to a plain `<img>` when the optimization
// endpoint isn’t available (static exports, GitHub Pages, etc.).

import Image, { ImageProps } from 'next/image';

// basePath / assetPrefix are expected to be set via environment
// variable in next.config.js.  Here we read the public version so
// the client bundle can see it too.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function NextImage(props: ImageProps) {
  // ensure string src values starting with "/" get the prefix
  // added (e.g. "/asset/image/foo.jpg" => "/repo/asset/image/foo.jpg").
  // leave remote URLs alone.
  let src = props.src;
  if (typeof src === 'string' && src.startsWith('/') && basePath) {
    src = `${basePath}${src}`;
  }

  // spread props but always disable optimization (safer for static
  // hosting) and use the possibly‑modified src value.
  return <Image {...props} src={src} unoptimized />;
}
