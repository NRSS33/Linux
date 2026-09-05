// 标题折叠：像 Obsidian 一样，点击 h2 章节标题折叠其下内容（直到下一个 h2）。
// 用 CSS ::before 显示箭头，不向 h2 插入子元素，避免干扰 SPA 的 DOM diff。
// 此文件被 inline-script-loader 直接作为代码 bundle（无 export），再注入页面。

var FOLD = "fold-collapsed"

function ensureStyle() {
  if (document.getElementById("heading-fold-style")) return
  var s = document.createElement("style")
  s.id = "heading-fold-style"
  s.textContent = [
    "article h2 { cursor: pointer; }",
    "article h2::before {",
    '  content: "\\25BE";',
    "  display: inline-block; width: 1em; margin-right: 0.3em;",
    "  color: var(--gray, #999); transition: transform .15s ease, color .15s ease;",
    "}",
    "article h2:hover::before { color: var(--secondary, #284b63); }",
    "article h2.fold-collapsed::before { transform: rotate(-90deg); }",
    ".fold-section-hidden { display: none !important; }",
  ].join("\n")
  document.head.appendChild(s)
}

function keyFor(h2) {
  return "fold:" + window.location.pathname + "#" + (h2.id || "")
}

function isCollapsed(h2) {
  try {
    return localStorage.getItem(keyFor(h2)) === "1"
  } catch (e) {
    return false
  }
}

function setCollapsed(h2, v) {
  try {
    if (v) localStorage.setItem(keyFor(h2), "1")
    else localStorage.removeItem(keyFor(h2))
  } catch (e) {}
}

// 折叠/展开：遍历 h2 后续兄弟，直到下一个 h2
function apply(h2) {
  var collapsed = isCollapsed(h2)
  h2.classList.toggle(FOLD, collapsed)
  var el = h2.nextElementSibling
  while (el && el.tagName !== "H2") {
    el.classList.toggle("fold-section-hidden", collapsed)
    el = el.nextElementSibling
  }
}

function toggle(h2) {
  setCollapsed(h2, !isCollapsed(h2))
  apply(h2)
}

function init() {
  ensureStyle()
  var h2s = document.querySelectorAll("article h2")
  for (var i = 0; i < h2s.length; i++) {
    var h2 = h2s[i]
    if (!h2.__foldBound) {
      h2.__foldBound = true
      h2.addEventListener("click", function (e) {
        if (e.target.closest("a")) return
        toggle(this)
      })
    }
    apply(h2)
  }
}

// 目标元素所属的章节 h2（向前找最近的 h2 兄弟）
function sectionH2Of(target) {
  var el = target
  while (el) {
    if (el.tagName === "H2") return el
    el = el.previousElementSibling
  }
  return null
}

// 跳到锚点（目录链接）时，若目标所在章节被折叠，先展开
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
  var h2 = sectionH2Of(target)
  if (h2 && isCollapsed(h2)) {
    setCollapsed(h2, false)
    apply(h2)
  }
}

document.addEventListener("nav", function () {
  init()
  expandForHash()
})
init()
