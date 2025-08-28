
export default {
  basePath: 'https://tame0001.github.io/lineup',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
