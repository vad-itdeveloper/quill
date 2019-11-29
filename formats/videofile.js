import { BlockEmbed } from '../blots/block';
import Link from './link';

const ATTRIBUTES = ['height', 'width'];

class VideoFile extends BlockEmbed {
  static create(value) {
    const node = super.create(value);
    node.setAttribute('src', this.sanitize(value));
    node.setAttribute('width', '100%');
		node.setAttribute('height', '100%');
		node.setAttribute('controls', true);
    return node;
  }

  static formats(domNode) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  static sanitize(url) {
    return Link.sanitize(url); // eslint-disable-line import/no-named-as-default-member
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }

  html() {
    const { video } = this.value();
    return `<a href="${video}">${video}</a>`;
  }
}
VideoFile.blotName = 'videofile';
VideoFile.className = 'ql-videofile';
VideoFile.tagName = 'VIDEO';

export default VideoFile;