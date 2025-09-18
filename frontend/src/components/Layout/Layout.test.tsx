import { render } from '@test-utils';
import { MemoryRouter } from 'react-router-dom';
import { removeMantineRandomAttributes } from '@/utils/tests';
import Layout from './Layout';

describe('Layout', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
