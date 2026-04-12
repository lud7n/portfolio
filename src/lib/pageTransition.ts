// ページ遷移トリガーをグローバルに保持するシングルトン
let _trigger: ((href: string) => void) | null = null;

export function setTransitionTrigger(fn: (href: string) => void) {
  _trigger = fn;
}

export function navigateTo(href: string) {
  if (_trigger) {
    _trigger(href);
  } else {
    window.location.href = href;
  }
}
