// 檢查是否已註冊
if (typeof window === 'undefined' || !window.customElements) {
  console.warn('Web Components are not supported in this environment.');
  throw new Error('Web Components are not supported in this environment.');
} else if (window.customElements.get('web-password-controller')) {
  console.warn('web-password-controller is already registered.');
  throw new Error('web-password-controller is already registered.');
}

/**
 * Password Controller Web Component
 */
class WebPasswordController extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        --password-controller-gap: 8px;
        
        display: flex;
        align-items: center;
        gap: var(--password-controller-gap);
      }
      :host([spinner-show]) {
        opacity: 1;
        pointer-events: auto;
      }
    `);

    this.shadowRoot!.adoptedStyleSheets = [sheet];

    const slot = document.createElement('slot');
    this.shadowRoot!.appendChild(slot);
  }
}

customElements.define('web-password-controller', WebPasswordController);

/**
 * Password Button Web Component
 * @attr {string} password-visible - 控制顯示或隱藏密碼
 */
class WebPasswordButton extends HTMLElement {
  private clickHandler: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes(): string[] {
    return ['password-visible'];
  }

  connectedCallback() {
    this._createShadowDom();
    this._init();
  }

  /**
   * 元件從 DOM 移除時的回調
   */
  disconnectedCallback() {
    this._cleanup();
  }

  /**
   * 屬性變更時的回調
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'password-visible' && oldValue !== newValue) {
      this._updateVisibility(newValue);
    }
  }

  /**
   * 建立 shadow dom
   */
  private _createShadowDom() {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      :host {
        --password-button-width: 24px;
        --password-button-height: 24px;

        width: var(--password-button-width);
        height: var(--password-button-height);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      :host([password-visible="off"]) slot[name="on"] {
        display: none;
      }
      :host([password-visible="off"]) slot[name="off"] {
        display: block;
      }
      :host([password-visible="on"]) slot[name="on"] {
        display: block;
      }
      :host([password-visible="on"]) slot[name="off"] {
        display: none;
      }
    `);

    this.shadowRoot!.adoptedStyleSheets = [sheet];

    const slotOff = document.createElement('slot');
    slotOff.setAttribute('name', 'off');
    slotOff.setAttribute('aria-label', 'invisible password');
    slotOff.textContent = 'invisible password';

    const slotOn = document.createElement('slot');
    slotOn.setAttribute('name', 'on');
    slotOn.setAttribute('aria-label', 'visible password');
    slotOn.textContent = 'visible password';

    this.shadowRoot!.appendChild(slotOff);
    this.shadowRoot!.appendChild(slotOn);
  }

  /**
   * 初始化元件
   */
  private _init() {
    try {
      // 初始設定隱藏狀態
      if (!this.hasAttribute('password-visible') || this.getAttribute('password-visible') === '') {
        this.setAttribute('password-visible', 'off');
      }

      this.setAttribute('role', 'button');

      // 綁定事件
      this._bindEvents();
    } catch (error) {
      console.error('Password button initialization error:', error);
    }
  }

  /**
   * 綁定事件監聽器
   */
  private _bindEvents() {
    this.clickHandler = () => {
      const isVisible = this.getAttribute('password-visible') === 'on';
      this.setAttribute('password-visible', isVisible ? 'off' : 'on');
    };
    this.addEventListener('click', this.clickHandler);
  }

  /**
   * 清理資源
   */
  private _cleanup() {
    // 清理事件監聯器
    if (this.clickHandler) {
      this.removeEventListener('click', this.clickHandler);
    }
  }

  /**
   * 更新顯示隱藏狀態
   */
  private _updateVisibility(newValue: string | null) {
    const controller = this.closest('web-password-controller');
    const input = controller?.querySelector<HTMLInputElement>('input[type="password"], input[type="text"]');

    if (!input) {
      console.warn('No input element found');
      return;
    }

    if (newValue === 'on') {
      input.setAttribute('type', 'text');
    } else {
      input.setAttribute('type', 'password');
    }

    // 更新 aria-label
    this._updateAriaLabel(newValue);
  }

  /**
   * 更新 aria-label
   */
  private _updateAriaLabel(newValue: string | null) {
    const ariaLabel = this.querySelector(`[slot="${newValue}"]`)?.getAttribute('aria-label');
    if (ariaLabel) {
      this.setAttribute('aria-label', ariaLabel);
    }
  }

  // --- Public ---
  /**
   * 顯示密碼
   */
  on() {
    this.setAttribute('password-visible', 'on');
  }

  /**
   * 隱藏密碼
   */
  off() {
    this.setAttribute('password-visible', 'off');
  }

  /**
   * 移除元素
   */
  kill() {
    const killEvent = new CustomEvent('web-password-controller:kill', {
      detail: {
        element: this,
      },
      bubbles: true,
      cancelable: true,
    });
    this.dispatchEvent(killEvent);
    this.remove();
  }
}

customElements.define('web-password-button', WebPasswordButton);

// 匯出類別供外部使用
export { WebPasswordController, WebPasswordButton };

// 為 Custom Elements 擴充全域型別定義
declare global {
  interface HTMLElementTagNameMap {
    'web-password-controller': WebPasswordController;
    'web-password-button': WebPasswordButton;
  }

  interface HTMLElementEventMap {
    'web-password-controller:kill': CustomEvent<{ element: WebPasswordButton }>;
  }
}
