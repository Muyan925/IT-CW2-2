import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from '@/router/index'
import VueRouter from 'vue-router'
import store from '@/store'

// markdown editor
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';
import '@kangc/v-md-editor/lib/style/codemirror-editor.css';

// githubTheme
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

// vuepressTheme
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

import Prism from 'prismjs';

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// VueMarkdownEditor.use();
// import 'highlight.js/styles/base16/railscasts.css';

import '@/assets/css/highlight.css'


VMdEditor.Codemirror = Codemirror;
VMdEditor.use(createLineNumbertPlugin())
VMdEditor.use(githubTheme, {
  Hljs: hljs,
  
  codeHighlightExtensionMap: {
    vue: 'html',
  },
});

Vue.use(VMdEditor);

// markdown editor end

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueRouter)
// axios.defaults.baseURL = 'http://ess.sllowcat.com'
// axios.defaults.baseURL = 'http://192.168.31.246:8081'
axios.defaults.baseURL = 'http://localhost:8081'

axios.interceptors.request.use(function (config) {
  if (sessionStorage.getItem('token')) {
    config.headers.token = sessionStorage.getItem('token')
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

new Vue({
  router,
  store,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$axios = axios
  }
}).$mount('#app')
