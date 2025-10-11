import { seedVerb, seedTense } from '../seed.js';

export default seedVerb('Capire', 'to understand', [
  seedTense('indicativo', 'presente', { io: 'capisco', tu: 'capisci', 'lui_lei': 'capisce', noi: 'capiamo', voi: 'capite', loro: 'capiscono' }),
  seedTense('indicativo', 'imperfetto', { io: 'capivo', tu: 'capivi', 'lui_lei': 'capiva', noi: 'capivamo', voi: 'capivate', loro: 'capivano' }),
  seedTense('indicativo', 'futuro semplice', { io: 'capirò', tu: 'capirai', 'lui_lei': 'capirà', noi: 'capiremo', voi: 'capirete', loro: 'capiranno' }),
  seedTense('indicativo', 'passato remoto', { io: 'capii', tu: 'capisti', 'lui_lei': 'capiò', noi: 'capimmo', voi: 'capiste', loro: 'capirono' }),
  seedTense('indicativo', 'passato prossimo', { io: 'ho capito', tu: 'hai capito', 'lui_lei': 'ha capito', noi: 'abbiamo capito', voi: 'avete capito', loro: 'hanno capito' }),
  seedTense('indicativo', 'trapassato prossimo', { io: 'avevo capito', tu: 'avevi capito', 'lui_lei': 'aveva capito', noi: 'avevamo capito', voi: 'avevate capito', loro: 'avevano capito' }),
  seedTense('indicativo', 'trapassato remoto', { io: 'ebbi capito', tu: 'avesti capito', 'lui_lei': 'ebbe capito', noi: 'avemmo capito', voi: 'aveste capito', loro: 'ebbero capito' }),
  seedTense('indicativo', 'futuro anteriore', { io: 'avrò capito', tu: 'avrai capito', 'lui_lei': 'avrà capito', noi: 'avremo capito', voi: 'avrete capito', loro: 'avranno capito' })
]);