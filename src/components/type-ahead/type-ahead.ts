import {html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {TailwindElement} from '../../shared/tailwind.element.ts';
import style from './type-ahead.css?inline';
import 'iconify-icon';

type Event = InputEvent & { target: HTMLInputElement }

@customElement('type-ahead')
export class TypeAhead extends TailwindElement(style) {
  @property()
  placeholder: string | undefined;
  @property({reflect: true})
  value?: string;
  @property({type: Array})
  options: { label: string, value: string }[];

  @state()
  private _open: boolean;
  @state()
  private _listed: typeof this.options = [];
  @state()
  private _option?: string;
  @state()
  private _animating: 'in' | 'out' = 'out';

  openDropdown() {
    this._open = true;
    setTimeout(() => {
      this._animating = 'in';
    }, 1);
  }

  closeDropdown() {
    this._animating = 'out';
    setTimeout(() => {
      this._open = false;
    }, 500);
  }

  setState(state: boolean) {
    state ? this.openDropdown() : this.closeDropdown();
  }
  
  constructor() {
    super();
    this._open = false;
    this.options = [];

    //On click outside
    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as Element;
      if (target?.tagName === 'TYPE-AHEAD') {
        return;
      }

      this._open = false;
    });
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('options')) {
      this._listed = this.options;
    }
  }

  updateValue(e: Event) {
    e.preventDefault();

    this.value = e.target.dataset.value;
    this._option = this.options.find((o) => o.value === this.value)?.label || '';
    this.setState(false);
  }

  toggleDropdown(e: Event) {
    e.preventDefault();
    this.setState(!this._open);
  }

  filterOptions(e: Event) {
    const value = e.target.value;

    this._listed = this.options.filter((o) => o.label.toLowerCase().includes(value.toLowerCase()));
  }

  render() {
    return html`
        <div class="type-ahead-wrapper">
            <div class="input-wrapper">
                <input type="text"
                       placeholder="${this.placeholder}"
                       value="${this._option}"
                       @click="${this.toggleDropdown}"
                       @input="${this.filterOptions}"/>
                <button @click="${this.toggleDropdown}">
                    <iconify-icon icon="mdi:chevron-up-down"></iconify-icon>
                </button>
            </div>
            <div class="dropdown">
                ${
                    this._open ? html`
                        <ul class="drawer ${this._animating}">
                            ${this._listed.map(o => html`
                                <li class="${o.value === this.value ? 'selected' : ''}"
                                    aria-selected="${o.value === this.value}"
                                    data-value="${o.value}"
                                    @click="${this.updateValue}">
                                    <span>${o.label}</span>
                                </li>`
                            )}
                        </ul>` : ''

                }
            </div>
        </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'type-ahead': TypeAhead
  }
}
