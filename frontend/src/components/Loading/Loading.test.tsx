import { render } from '@test-utils';
import { describe, expect, it } from 'vitest';
import { removeMantineRandomAttributes } from '@/utils/tests';
import Loading from './Loading';

describe('Loading', () => {
  it('renders a centered loader with the correct props', () => {
    const container = render(<Loading />);

    const loaderElement = container.baseElement.getElementsByClassName('mantine-Loader-root')[0];
    expect(loaderElement).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<Loading />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
