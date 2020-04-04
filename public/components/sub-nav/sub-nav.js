import Component from 'can-component';
import './sub-nav.less';

export default Component.extend({
  tag: 'lbh3-sub-nav',
  view: `
    <nav class="border-bottom d-flex">
      <ul class="flex-row m-auto navbar-nav overflow-auto text-nowrap">
        <content />
      </ul>
    </nav>
  `
});
