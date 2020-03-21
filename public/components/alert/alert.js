import Component from 'can-component';

export default Component.extend({
  tag: 'lbh3-alert',
  view: `
    <div class="alert alert-info text-center" role="alert">
      <strong>{{message}}</strong>
      <div aria-hidden="true" class="spinner-border spinner-border-sm" role="status"></div>
    </div>
  `,
  ViewModel: {
    message: 'string'
  }
});
