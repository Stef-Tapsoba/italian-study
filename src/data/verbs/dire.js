import { seedVerb, seedTense } from '../seed.js';

export default seedVerb('Dire', 'to say', [
  seedTense('indicativo', 'presente', { io: 'dico', tu: 'dici', 'lui_lei': 'dice', noi: 'diciamo', voi: 'dite', loro: 'dicono' }),
  seedTense('indicativo', 'imperfetto', { io: 'dicevo', tu: 'dicevi', 'lui_lei': 'diceva', noi: 'dicevamo', voi: 'dicevate', loro: 'dicevano' }),
  seedTense('indicativo', 'futuro semplice', { io: 'dirò', tu: 'dirai', 'lui_lei': 'dirà', noi: 'diremo', voi: 'direte', loro: 'diranno' }),
  seedTense('indicativo', 'passato remoto', { io: 'dissi', tu: 'dicesti', 'lui_lei': 'disse', noi: 'dicemmo', voi: 'diceste', loro: 'dissero' }),
  seedTense('indicativo', 'passato prossimo', { io: 'ho detto', tu: 'hai detto', 'lui_lei': 'ha detto', noi: 'abbiamo detto', voi: 'avete detto', loro: 'hanno detto' }),
  seedTense('indicativo', 'trapassato prossimo', { io: 'avevo detto', tu: 'avevi detto', 'lui_lei': 'aveva detto', noi: 'avevamo detto', voi: 'avevate detto', loro: 'avevano detto' }),
  seedTense('indicativo', 'trapassato remoto', { io: 'ebbi detto', tu: 'avesti detto', 'lui_lei': 'ebbe detto', noi: 'avemmo detto', voi: 'aveste detto', loro: 'ebbero detto' }),
  seedTense('indicativo', 'futuro anteriore', { io: 'avrò detto', tu: 'avrai detto', 'lui_lei': 'avrà detto', noi: 'avremo detto', voi: 'avrete detto', loro: 'avranno detto' })
]);
