// ページ遷移トリガーをグローバルに保持するシングルトン
let _trigger: ((href: string) => void) | null = null;
let _routerPush: ((href: string) => void) | null = null;

export function setTransitionTrigger(fn: (href: string) => void) {
  _trigger = fn;
}

export function setRouterPush(fn: (href: string) => void) {
  _routerPush = fn;
}

export function navigateTo(href: string) {
  if (_trigger) {
    _trigger(href);
  } else if (_routerPush) {
    // フォールバック: アニメーションなしで router.push（window.location は使わない）
    _routerPush(href);
  }
}
