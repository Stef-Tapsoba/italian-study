import { seedVerb, seedTense } from '../seed.js';

export default seedVerb('Venire', 'to come', [
  seedTense('indicativo', 'presente', { io: 'vengo', tu: 'vieni', 'lui_lei': 'viene', noi: 'veniamo', voi: 'venite', loro: 'vengono' }),
  seedTense('indicativo', 'imperfetto', { io: 'venivo', tu: 'venivi', 'lui_lei': 'veniva', noi: 'venivamo', voi: 'venivate', loro: 'venivano' }),
  seedTense('indicativo', 'futuro semplice', { io: 'verrò', tu: 'verrai', 'lui_lei': 'verrà', noi: 'verremo', voi: 'verrete', loro: 'verranno' }),
  seedTense('indicativo', 'passato remoto', { io: 'venni', tu: 'venisti', 'lui_lei': 'venne', noi: 'venimmo', voi: 'veniste', loro: 'vennero' }),
  seedTense('indicativo', 'passato prossimo', { io: 'sono venuto/a', tu: 'sei venuto/a', 'lui_lei': 'è venuto/a', noi: 'siamo venuti/e', voi: 'siete venuti/e', loro: 'sono venuti/e' }),
  seedTense('indicativo', 'trapassato prossimo', { io: 'ero venuto/a', tu: 'eri venuto/a', 'lui_lei': 'era venuto/a', noi: 'eravamo venuti/e', voi: 'eravate venuti/e', loro: 'erano venuti/e' }),
  seedTense('indicativo', 'trapassato remoto', { io: 'fui venuto/a', tu: 'fosti venuto/a', 'lui_lei': 'fu venuto/a', noi: 'fummo venuti/e', voi: 'foste venuti/e', loro: 'furono venuti/e' }),
  seedTense('indicativo', 'futuro anteriore', { io: 'sarò venuto/a', tu: 'sarai venuto/a', 'lui_lei': 'sarà venuto/a', noi: 'saremo venuti/e', voi: 'sarete venuti/e', loro: 'saranno venuti/e' })
]);