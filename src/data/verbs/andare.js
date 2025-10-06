import { seedVerb, seedTense } from '../seed.js';

export default seedVerb('Andare', 'to go', [
  seedTense('indicativo', 'presente', { io: 'vado', tu: 'vai', 'lui_lei': 'va', noi: 'andiamo', voi: 'andate', loro: 'vanno' }),
  seedTense('indicativo', 'imperfetto', { io: 'andavo', tu: 'andavi', 'lui_lei': 'andava', noi: 'andavamo', voi: 'andavate', loro: 'andavano' }),
  seedTense('indicativo', 'futuro semplice', { io: 'andrò', tu: 'andrai', 'lui_lei': 'andrà', noi: 'andremo', voi: 'andrete', loro: 'andranno' }),
  seedTense('indicativo', 'passato remoto', { io: 'andai', tu: 'andasti', 'lui_lei': 'andò', noi: 'andammo', voi: 'andaste', loro: 'andarono' }),
  seedTense('indicativo', 'passato prossimo', { io: 'sono andato', tu: 'sei andato', 'lui_lei': 'è andato(a)', noi: 'siamo andati', voi: 'siete andati', loro: 'sono andati(e)' }),
  seedTense('indicativo', 'trapassato prossimo', { io: 'ero andato', tu: 'eri andato', 'lui_lei': 'era andato(a)', noi: 'eravamo andati', voi: 'eravate andati', loro: 'erano andato(e)' }),
  seedTense('indicativo', 'trapassato remoto', { io: 'fui andato', tu: 'fosti andato', 'lui_lei': 'fu andato(a)', noi: 'fummo andati', voi: 'foste andati', loro: 'furono andati(e)' }),
  seedTense('indicativo', 'futuro anteriore', { io: 'sarò andato', tu: 'sarai andato', 'lui_lei': 'sarà andato(a)', noi: 'saremo andati', voi: 'sarete andati', loro: 'saranno andati(e)' })
]);
