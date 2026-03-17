import { renderProfileList } from './components/ProfileList';
import { renderProfileEditor } from './components/ProfileEditor';
import { renderSetup } from './components/Setup';
import { RouterState } from './types';

const app = document.getElementById('app')!;

let state: RouterState = { route: 'list' };

function navigate(newState: RouterState): void {
  state = newState;
  render();
}

function render(): void {
  app.innerHTML = '';
  switch (state.route) {
    case 'list':
      renderProfileList(
        app,
        (id) => navigate({ route: 'edit', editProfileId: id }),
        () => navigate({ route: 'setup' }),
      );
      break;
    case 'edit':
      if (state.editProfileId) {
        renderProfileEditor(app, state.editProfileId, () => navigate({ route: 'list' }));
      }
      break;
    case 'setup':
      renderSetup(app, () => navigate({ route: 'list' }));
      break;
  }
  window.scrollTo(0, 0);
}

// Initial render
render();
