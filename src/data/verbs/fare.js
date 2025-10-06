import { seedVerb, seedTense } from '../seed.js';

export default seedVerb('Fare', 'to do, to make', [
  seedTense('indicativo', 'presente', { io: 'faccio', tu: 'fai', 'lui_lei': 'fa', noi: 'facciamo', voi: 'fate', loro: 'fanno' }),
  seedTense('indicativo', 'imperfetto', { io: 'facevo', tu: 'facevi', 'lui_lei': 'faceva', noi: 'facevamo', voi: 'facevate', loro: 'facevano' }),
  seedTense('indicativo', 'futuro semplice', { io: 'farò', tu: 'farai', 'lui_lei': 'farà', noi: 'faremo', voi: 'farete', loro: 'faranno' }),
  seedTense('indicativo', 'passato remoto', { io: 'feci', tu: 'facesti', 'lui_lei': 'fece', noi: 'facemmo', voi: 'faceste', loro: 'fecero' }),
  seedTense('indicativo', 'passato prossimo', { io: 'ho fatto', tu: 'hai fatto', 'lui_lei': 'ha fatto', noi: 'abbiamo fatto', voi: 'avete fatto', loro: 'hanno fatto' }),
  seedTense('indicativo', 'trapassato prossimo', { io: 'avevo fatto', tu: 'avevi fatto', 'lui_lei': 'aveva fatto', noi: 'avevamo fatto', voi: 'avevate fatto', loro: 'avevano fatto' }),
  seedTense('indicativo', 'trapassato remoto', { io: 'ebbi fatto', tu: 'avesti fatto', 'lui_lei': 'ebbe fatto', noi: 'avemmo fatto', voi: 'aveste fatto', loro: 'ebbero fatto' }),
  seedTense('indicativo', 'futuro anteriore', { io: 'avrò fatto', tu: 'avrai fatto', 'lui_lei': 'avrà fatto', noi: 'avremo fatto', voi: 'avrete fatto', loro: 'avranno fatto' })
]);
