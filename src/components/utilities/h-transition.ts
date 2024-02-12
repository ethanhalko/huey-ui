import {customElement, property, state} from 'lit/decorators.js';
import {TailwindElement} from '../../shared/tailwind.element.ts';
import {html} from 'lit';
import {when} from 'lit/directives/when.js';

@customElement('h-transition')
export class HTransition extends TailwindElement('') {
  @state()
  private _ready: boolean = false;
  @state()
  private _activeTransition: string = '';
  @state()
  private _isShowing: boolean = false;
  @property({type: Boolean})
  show: boolean = false;
  @property({type: String})
  transitionTo: string = '';
  @property({type: String})
  transitionFrom: string = '';
  @property({type: Number})
  duration: number = 150;

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

    if (changedProperties.has('show')) {
      this._isShowing ? this.transitionOut() : this.transitionIn();
    }
  }

  transitionIn() {
    this._isShowing = true;
    setTimeout(() => {
      this._activeTransition = this.transitionTo;
    }, 1);
  }

  transitionOut() {
    this._activeTransition = this.transitionFrom;
    setTimeout(() => {
      this._isShowing = false;
    }, this.duration * 1.5);
  }

  render() {
    return html`
        <div class="${this._activeTransition}">
            ${
                when(this._isShowing, () => html`
                    <slot></slot>`)
            }
        </div>
    `
  }
}
