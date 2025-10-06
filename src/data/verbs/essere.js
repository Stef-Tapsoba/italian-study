import { seedVerb, seedTense } from '../seed.js';

export default seedVerb('Essere', 'to be', [
  seedTense('indicativo', 'presente', { io: 'sono', tu: 'sei', 'lui_lei': 'è', noi: 'siamo', voi: 'siete', loro: 'sono' }),
  seedTense('indicativo', 'imperfetto', { io: 'ero', tu: 'eri', 'lui_lei': 'era', noi: 'eravamo', voi: 'eravate', loro: 'erano' }),
  seedTense('indicativo', 'futuro semplice', { io: 'sarò', tu: 'sarai', 'lui_lei': 'sarà', noi: 'saremo', voi: 'sarete', loro: 'saranno' }),
  seedTense('indicativo', 'passato remoto', { io: 'fui', tu: 'fosti', 'lui_lei': 'fu', noi: 'fummo', voi: 'foste', loro: 'furono' }),
  seedTense('indicativo', 'passato prossimo', { io: 'sono stato', tu: 'sei stato', 'lui_lei': 'è stato(a)', noi: 'siamo stati', voi: 'siete stati', loro: 'sono stati(e)' }),
  seedTense('indicativo', 'trapassato prossimo', { io: 'ero stato', tu: 'eri stato', 'lui_lei': 'era stato(a)', noi: 'eravamo stati', voi: 'eravate stati', loro: 'erano stati(e)' }),
  seedTense('indicativo', 'trapassato remoto', { io: 'fui stato', tu: 'fosti stato', 'lui_lei': 'fu stato(a)', noi: 'fummo stati', voi: 'foste stati', loro: 'furono stati(e)' }),
  seedTense('indicativo', 'futuro anteriore', { io: 'sarò stato', tu: 'sarai stato', 'lui_lei': 'sarà stato(a)', noi: 'saremo stati', voi: 'sarete stati', loro: 'saranno stati(e)' })
]);
