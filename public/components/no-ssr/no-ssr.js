import Component from 'can-component';
import platform from 'steal-platform';

export default Component.extend({
  tag: 'lbh3-no-ssr',
  view: `{{^eq platform.isNode true}}<content />{{/eq}}`,
  ViewModel: {
    platform: {
      default: () => {
        return platform;
      }
    }
  }
});
