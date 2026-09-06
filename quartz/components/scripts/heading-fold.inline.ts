// 多级标题折叠：像 Obsidian 一样，任意层级的标题（h2/h3/h4...）都能折叠其下内容，
// 直到遇到同级或更高级的标题。折叠状态持久化到 localStorage。
// 用 CSS ::before 显示箭头，不向标题插入子元素，避免干扰 SPA 的 DOM diff。
// 嵌套折叠通过「折叠栈」统一计算可见性，避免各层级 class 相互覆盖。

var FOLD = "fold-collapsed"

function ensureStyle() {
  if (document.getElementById("heading-fold-style")) return
  var s = document.createElement("style")
  s.id = "heading-fold-style"
  s.textContent = [
    "article :is(h2, h3, h4, h5, h6) { cursor: pointer; }",
    "article :is(h2, h3, h4, h5, h6)::before {",
    '  content: "\\25BE";',
    "  display: inline-block; width: 1em; margin-right: 0.3em;",
    "  color: var(--gray, #999); transition: transform .15s ease, color .15s ease;",
    "}",
    "article :is(h2, h3, h4, h5, h6):hover::before { color: var(--secondary, #284b63); }",
    "article :is(h2, h3, h4, h5, h6).fold-collapsed::before { transform: rotate(-90deg); }",
    ".fold-section-hidden { display: none !important; }",
  ].join("\n")
  document.head.appendChild(s)
}

function headingLevel(el) {
  var m = /^H([1-6])$/.exec(el.tagName)
  return m ? parseInt(m[1], 10) : 0
}

function keyFor(h) {
  return "fold:" + window.location.pathname + "#" + (h.id || "")
}

function isCollapsed(h) {
  try {
    return localStorage.getItem(keyFor(h)) === "1"
  } catch (e) {
    return false
  }
}

function setCollapsed(h, v) {
  try {
    if (v) localStorage.setItem(keyFor(h), "1")
    else localStorage.removeItem(keyFor(h))
  } catch (e) {}
}

// 统一重算整篇文章的可见性：用「折叠层级栈」判断每个元素是否被某个折叠标题覆盖
function refreshVisibility() {
  var firstHeading = document.querySelector("article h2, article h3, article h4, article h5, article h6")
  if (!firstHeading) return
  var children = firstHeading.parentElement.children
  var stack = [] // 当前生效的折叠标题层级（递增）
  for (var i = 0; i < children.length; i++) {
    var el = children[i]
    var lv = headingLevel(el)
    var hidden = stack.length > 0
    if (lv > 0) {
      // 标题：结束所有层级 >= lv 的折叠（它们的范围到此为止）
      while (stack.length && stack[stack.length - 1] >= lv) stack.pop()
      hidden = stack.length > 0
      // 若此标题自身折叠，压入栈，覆盖其后内容
      if (el.classList.contains(FOLD)) stack.push(lv)
    }
    el.classList.toggle("fold-section-hidden", hidden)
  }
}

function toggle(h) {
  setCollapsed(h, !isCollapsed(h))
  h.classList.toggle(FOLD, isCollapsed(h))
  refreshVisibility()
}

function init() {
  ensureStyle()
  var hs = document.querySelectorAll("article h2, article h3, article h4, article h5, article h6")
  for (var i = 0; i < hs.length; i++) {
    var h = hs[i]
    h.classList.toggle(FOLD, isCollapsed(h))
    if (!h.__foldBound) {
      h.__foldBound = true
      h.addEventListener("click", function (e) {
        if (e.target.closest("a")) return
        toggle(this)
      })
    }
  }
  refreshVisibility()
}

// 目标元素前面最近的折叠标题（用于锚点跳转时自动展开）
function foldedHeadingOf(target) {
  var el = target
  while (el) {
    if (el.classList && el.classList.contains(FOLD)) return el
    el = el.previousElementSibling
  }
  return null
}

function expandFold(target) {
  var h = foldedHeadingOf(target)
  if (h) {
    setCollapsed(h, false)
    h.classList.remove(FOLD)
    refreshVisibility()
  }
}

function expandForHash() {
  var hash = window.location.hash
  if (!hash) return
  var target
  try {
    target = document.getElementById(decodeURIComponent(hash.slice(1)))
  } catch (e) {
    return
  }
  if (!target) return
  expandFold(target)
}

// 暴露给 SPA 路由：同页锚点跳转前先展开被折叠的标题
window.expandFold = expandFold

document.addEventListener("nav", function () {
  init()
  expandForHash()
})
init()
