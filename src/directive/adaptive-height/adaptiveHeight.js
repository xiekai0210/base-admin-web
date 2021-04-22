import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

const doResize = (el) => {
  const height = window.innerHeight - el.getBoundingClientRect().top
  el.style.height = height + 'px'
}

export default {
  bind(el) {
    el.resizeListener = () => {
      doResize(el)
    }
    addResizeListener(window.document.body, el.resizeListener)
  },
  inserted(el) {
    doResize(el)
  },
  update(el) {
    doResize(el)
  },
  unbind(el) {
    removeResizeListener(window.document.body, el.resizeListener)
  }
}
