import adaptiveHeight from './adaptiveHeight'

const install = function(Vue) {
  Vue.directive('auto-height-adaptive', adaptiveHeight)
}

if (window.Vue) {
  window['auto-height-adaptive'] = adaptiveHeight
  Vue.use(install); // eslint-disable-line
}

adaptiveHeight.install = install
export default adaptiveHeight
