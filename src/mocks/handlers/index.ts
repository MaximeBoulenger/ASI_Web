import { parcoursHandlers } from './parcours.handler';
import { etudiantsHandlers } from './etudiants.handler';
import { uesHandlers } from './ues.handler';

export const handlers = [...parcoursHandlers, ...etudiantsHandlers, ...uesHandlers];
