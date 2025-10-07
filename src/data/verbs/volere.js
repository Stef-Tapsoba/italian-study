import { seedVerb, seedTense } from '../seed.js';

export default seedVerb('Volere', 'to want', [
  seedTense('indicativo', 'presente', { io: 'voglio', tu: 'vuoi', 'lui_lei': 'vuole', noi: 'vogliamo', voi: 'volete', loro: 'vogliono' }),
  seedTense('indicativo', 'imperfetto', { io: 'volevo', tu: 'voleva', 'lui_lei': 'voleva', noi: 'volevamo', voi: 'volevate', loro: 'volevano' }),
  seedTense('indicativo', 'futuro semplice', { io: 'vorrò', tu: 'vorrai', 'lui_lei': 'vorrà', noi: 'vorremo', voi: 'vorrete', loro: 'vorranno' }),
  seedTense('indicativo', 'passato remoto', { io: 'volsi', tu: 'volesti', 'lui_lei': 'volse', noi: 'volgemmo', voi: 'volgeste', loro: 'volsero' }),
  seedTense('indicativo', 'passato prossimo', { io: 'ho voluto', tu: 'hai voluto', 'lui_lei': 'ha voluto', noi: 'abbiamo voluto', voi: 'avete voluto', loro: 'hanno voluto' }),
  seedTense('indicativo', 'trapassato prossimo', { io: 'avevo voluto', tu: 'avevi voluto', 'lui_lei': 'aveva voluto', noi: 'avevamo voluto', voi: 'avevate voluto', loro: 'avevano voluto' }),
  seedTense('indicativo', 'trapassato remoto', { io: 'ebbi voluto', tu: 'avesti voluto', 'lui_lei': 'ebbe voluto', noi: 'avemmo voluto', voi: 'aveste voluto', loro: 'ebbero voluto' }),
  seedTense('indicativo', 'futuro anteriore', { io: 'avrò voluto', tu: 'avrai voluto', 'lui_lei': 'avrà voluto', noi: 'avremo voluto', voi: 'avrete voluto', loro: 'avranno voluto' })
]);