import {customElement, property, state} from 'lit/decorators.js';
import {html, PropertyValues} from 'lit';
import {TailwindElement} from '../../../shared/tailwind.element.ts';
import {when} from 'lit/directives/when.js';
import {swapClasses} from '../../../helpers/dom.ts';
import {getModifierFromClassList} from '../../../helpers/parsing.ts';

@customElement('h-transition')
export class HTransition extends TailwindElement('') {
  @state()
  private _ready: boolean = false;
  @state()
  private _isShowing: boolean = false;
  @property({type: Boolean})
  show: boolean = false;
  @property({type: String})
  transition: string = 'transition-opacity';
  @property({type: String})
  enterFrom: string = 'opacity-0';
  @property({type: String})
  enterTo: string = 'opacity-100';

  get _slottedChildren() {
    const slot = this.shadowRoot!.querySelector('slot')!;
    return slot?.assignedElements({flatten: true}) || [];
  }

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    // Add property classes to the slot
    const slot = this._slottedChildren;
    slot[0].classList.add(this.transition, ...this.enterFrom.split(' '));

    this._ready = true;
  }

  updated(changedProperties: Map<string, any>) {
    if (this._ready && changedProperties.get('show') !== undefined) {
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

      swapClasses(children, this.enterFrom, this.enterTo);
    }, 1);
  }

  transitionOut() {
    const children = this._slottedChildren;
    if (children.length > 1) {
      return;
    }

    const duration = getModifierFromClassList(this.enterFrom, 'duration') || 200;
    swapClasses(children, this.enterTo, this.enterFrom);
    setTimeout(() => {
      this._isShowing = false;
    }, duration);
  }

  render() {
    return html`
        <span class="${when(!this._isShowing, () => 'hidden')}"><slot></slot></span>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'h-transition': HTransition
  }
}
