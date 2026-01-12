# web-password

一個用於密碼顯示/隱藏切換的 Web Component。

## 安裝

### NPM

```bash
npm install @umon752/web-password
```

### CDN

```html
<!-- unpkg -->
<script type="module" src="https://unpkg.com/@umon752/web-password"></script>

<!-- 或 jsDelivr -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@umon752/web-password"></script>
```

## 使用方式

### ES Module

```javascript
import '@umon752/web-password';
```

### HTML

```html
<web-password-controller>
  <input type="password" id="password" name="password" placeholder="請輸入密碼">
  
  <web-password-button>
    <!-- 密碼可見時顯示 -->
    <div slot="on" aria-label="顯示密碼">👁️</div>
    <!-- 密碼隱藏時顯示 -->
    <div slot="off" aria-label="隱藏密碼">👁️‍🗨️</div>
  </web-password-button>
</web-password-controller>
```

## API

### `<web-password-controller>`

容器元件，用於包裹 `<input>` 和 `<web-password-button>`。

#### CSS 變數

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `--password-controller-gap` | `8px` | 子元素間距 |

### `<web-password-button>`

密碼顯示/隱藏切換按鈕。

#### 屬性 (Attributes)

| 屬性名稱 | 類型 | 預設值 | 說明 |
|---------|------|--------|------|
| `password-visible` | `'on'` \| `'off'` | `'off'` | 控制密碼顯示狀態 |

#### 方法 (Methods)

| 方法名稱 | 說明 |
|---------|------|
| `on()` | 顯示密碼 |
| `off()` | 隱藏密碼 |
| `kill()` | 移除元件並觸發 `web-password-controller:kill` 事件 |

#### CSS 變數

| 變數名稱 | 預設值 | 說明 |
|---------|--------|------|
| `--password-button-width` | `24px` | 按鈕寬度 |
| `--password-button-height` | `24px` | 按鈕高度 |

#### Slots

| Slot 名稱 | 說明 |
|----------|------|
| `on` | 密碼可見時顯示的內容 |
| `off` | 密碼隱藏時顯示的內容 |

#### 事件 (Events)

| 事件名稱 | 說明 |
|---------|------|
| `web-password-controller:kill` | 當呼叫 `kill()` 方法時觸發 |

## TypeScript 支援

此套件包含完整的 TypeScript 型別定義。

```typescript
import { WebPasswordController, WebPasswordButton } from 'web-password';

// 型別會自動識別
const button = document.querySelector('web-password-button');
button?.on();
```

## 瀏覽器支援

支援所有現代瀏覽器（Chrome、Firefox、Safari、Edge）。

## License

MIT
