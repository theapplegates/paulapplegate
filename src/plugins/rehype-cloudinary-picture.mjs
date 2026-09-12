import { fromHtml } from 'hast-util-from-html';
import { getPictureData } from '../lib/cloudinary-core.mjs';

const element = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });

function picture(properties, cloudName) {
  const src = properties.src || properties.publicid;
  if (properties.alt === undefined) throw new Error('Cloudinary images require alt text (use alt="" for decoration).');
  const options = { cloudName: properties['cloud-name'] || properties.cloudname || cloudName };
  for (const key of ['width', 'height', 'blur']) {
    if (properties[key] !== undefined) options[key] = Number(properties[key]);
  }
  for (const key of ['sizes', 'crop', 'gravity']) {
    if (properties[key]) options[key] = properties[key];
  }
  if (properties.widths) options.widths = String(properties.widths).split(',').map(Number);
  if (properties.grayscale !== undefined) options.grayscale = properties.grayscale !== 'false';
  const data = getPictureData(src, options);
  const loading = properties.loading || 'lazy';
  if (!['lazy', 'eager'].includes(loading)) throw new Error('Image loading must be lazy or eager.');
  const attributes = { ...data.img, alt: String(properties.alt), loading, decoding: 'async' };
  if (properties.className) attributes.className = properties.className;
  if (properties.title) attributes.title = properties.title;
  return element('picture', { className: ['cloudinary-picture'] }, [
    ...data.sources.map(source => element('source', source)),
    element('img', attributes),
  ]);
}

/** Supports ordinary ![alt](cloudinary:public-id) and an import-free custom HTML tag in .md. */
export default function rehypeCloudinaryPicture({ cloudName } = {}) {
  return (tree, file) => {
    function walk(parent) {
      if (['pre', 'code', 'picture'].includes(parent.tagName)) return;
      for (let index = 0; index < (parent.children?.length ?? 0); index++) {
        const node = parent.children[index];
        try {
          if (node.type === 'raw' && /^\s*<cloudinary-picture\b/i.test(node.value)) {
            const fragment = fromHtml(node.value, { fragment: true });
            walk(fragment);
            parent.children.splice(index, 1, ...fragment.children);
            index += fragment.children.length - 1;
          } else if (node.type === 'element' && (
            node.tagName === 'cloudinary-picture' ||
            (node.tagName === 'img' && String(node.properties.src).startsWith('cloudinary:'))
          )) {
            parent.children[index] = picture(node.properties, cloudName);
          } else {
            walk(node);
          }
        } catch (error) {
          file.fail(`Cloudinary picture: ${error.message}`, node);
        }
      }
    }
    walk(tree);
  };
}
