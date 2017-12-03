import { render } from '../../node_modules/lit-html/lib/lit-extended';

export default base =>
  class extends base {
    render() {}

    async invalidate(instant) {
      if (!this.needsRender) {
        if (!instant) {
          this.needsRender = true;
          await 0;
          this.needsRender = false;
        }
        render(this.render(), this.shadowRoot);
      }
    }
  };
