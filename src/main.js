import './styles/main.css';
import './content/index.js';
import { FIGS } from './engine/registry.js';
import { homeFigure } from './content/extras.js';
import { initNav } from './app/nav.js';
import { initTheme } from './app/theme.js';
import { startRouter } from './app/router.js';
import { $ } from './app/dom.js';

FIGS.home_eq = homeFigure;
initTheme($('#themeBtn'));
initNav();
startRouter();
