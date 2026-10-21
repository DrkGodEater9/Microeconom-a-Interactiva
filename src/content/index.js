import { CHAPTERS } from '../engine/registry.js';
import { applyExtras } from './extras.js';

// Cada módulo de capítulo registra su capítulo y sus figuras en los registros globales.
import.meta.glob('./chapters/ch*.js', { eager: true });

applyExtras();
CHAPTERS.sort((a, b) => a.id - b.id);
