import {customElement, property, state} from 'lit/decorators.js';
import {html} from 'lit';
import {TailwindElement} from '../../../shared/tailwind.element.ts';

@customElement('h-transition')
export class HTransition extends TailwindElement('') {
  @state()
  private _ready: boolean = false;
  @state()
  private _isShowing: boolean = false;
  @property({type: Boolean})
  show: boolean = false;
  @property({type: String})
  transition: string = '';
  @property({type: String})
  enterFrom: string = 'opacity-0';
  @property({type: String})
  enterTo: string = 'opacity-100';
  @property({type: Number})
  duration: number = 50;

  get _slottedChildren() {
    const slot = this.shadowRoot!.querySelector('slot')!;
    return slot.assignedElements({flatten: true});
  }

  // Unsafe - add tag validation before implementing
  // @property()
  // element: String = 'div';
  // tagName = literal`${this.element}`

  connectedCallback() {
    super.connectedCallback();
    this._ready = true;
  }

  updated(changedProperties: Map<string, any>) {
    if (!this._ready) {
      return;
    }

    if (changedProperties.get('show') !== undefined) {
      this._isShowing ? this.transitionOut() : this.transitionIn();
    }
  }

  transitionIn() {
    this._isShowing = true;

    setTimeout(() => {
      const children = this._slottedChildren;
      if (children.length > 1) {
        return;
      }

      children[0].classList.remove(this.enterFrom);
      children[0].classList.add(this.enterTo);
    }, 1);
  }

  transitionOut() {
    const children = this._slottedChildren;
    if (children.length > 1) {
      return;
    }

    children[0].classList.add(this.enterFrom);
    children[0].classList.remove(this.enterTo);
    setTimeout(() => {
      this._isShowing = false;
    }, this.duration * 1.5);
  }

  render() {
    return html`
        ${
            this._isShowing ? html`
                <slot></slot>` : ''
        }`
  }
}
