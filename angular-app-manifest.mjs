
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://tame0001.github.io/lineup/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/lineup"
  },
  {
    "renderMode": 2,
    "route": "/lineup/admin"
  },
  {
    "renderMode": 2,
    "route": "/lineup/player"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24679, hash: 'cecc209ec5a4162ac12c153436084718fbebc592fbd41833c484c94046b8141a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17146, hash: '8b9b50122f795689246777beaca3abcf1241f7c2f8d942f2ef8f760df476b1d7', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'player/index.html': {size: 25097, hash: '026d2ae677f2eb919becb610fe1822eaa753eb80f1e226a6e8d79c7b76385b63', text: () => import('./assets-chunks/player_index_html.mjs').then(m => m.default)},
    'admin/index.html': {size: 25094, hash: 'c1201148657a35a7440fb80af7c49c4060a14bc66453182588b66e5632c2c015', text: () => import('./assets-chunks/admin_index_html.mjs').then(m => m.default)},
    'index.html': {size: 113288, hash: 'df0eae42426c1d09f70d932515f221f506ceb1d433aee2d0ec894f7218227baf', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-MJOGNMTA.css': {size: 8086, hash: 'hu9Wb016Lco', text: () => import('./assets-chunks/styles-MJOGNMTA_css.mjs').then(m => m.default)}
  },
};
