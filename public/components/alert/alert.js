import Component from 'can-component';
import './alert.less';

export default Component.extend({
  tag: 'lbh3-alert',
  view: `
    <can-import from="@fortawesome/fontawesome-free/css/fontawesome.css" />
    <can-import from="@fortawesome/fontawesome-free/css/solid.css" />
    <div class="alert alert-info" role="alert">
      <strong>{{message}}</strong>
      <span class="fas fa-circle-notch fa-spin"></span>
    </div>
  `,
  ViewModel: {
    message: 'string'
  }
});
