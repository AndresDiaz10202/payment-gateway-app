import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    expect(container).toBeTruthy();
  });

  it('shows loading spinner initially', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });
});