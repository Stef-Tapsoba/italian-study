import { seedVerb, seedTense } from '../seed.js';

export default seedVerb('Avere', 'to have', [
  seedTense('indicativo', 'presente', { io: 'ho', tu: 'hai', 'lui_lei': 'ha', noi: 'abbiamo', voi: 'avete', loro: 'hanno' }),
  seedTense('indicativo', 'imperfetto', { io: 'avevo', tu: 'avevi', 'lui_lei': 'aveva', noi: 'avevamo', voi: 'avevate', loro: 'avevano' }),
  seedTense('indicativo', 'futuro semplice', { io: 'avrò', tu: 'avrai', 'lui_lei': 'avrà', noi: 'avremo', voi: 'avrete', loro: 'avranno' }),
  seedTense('indicativo', 'passato remoto', { io: 'ebbi', tu: 'avesti', 'lui_lei': 'ebbe', noi: 'avemmo', voi: 'aveste', loro: 'ebbero' }),
  seedTense('indicativo', 'passato prossimo', { io: 'ho avuto', tu: 'hai avuto', 'lui_lei': 'ha avuto', noi: 'abbiamo avuto', voi: 'avete avuto', loro: 'hanno avuto' }),
  seedTense('indicativo', 'trapassato prossimo', { io: 'avevo avuto', tu: 'avevi avuto', 'lui_lei': 'aveva avuto', noi: 'avevamo avuto', voi: 'avevate avuto', loro: 'avevano avuto' }),
  seedTense('indicativo', 'trapassato remoto', { io: 'ebbi avuto', tu: 'avesti avuto', 'lui_lei': 'ebbe avuto', noi: 'avemmo avuto', voi: 'aveste avuto', loro: 'ebbero avuto' }),
  seedTense('indicativo', 'futuro anteriore', { io: 'avrò avuto', tu: 'avrai avuto', 'lui_lei': 'avrà avuto', noi: 'avremo avuto', voi: 'avrete avuto', loro: 'avranno avuto' })
]);
