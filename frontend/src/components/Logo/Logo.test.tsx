import { render } from '@test-utils';
import { removeMantineRandomAttributes } from '@/utils/tests';
import { LogoFull, LogoIcon, LogoText } from './Logo';

describe('Logo', () => {
  it('LogoFull matches snapshot', () => {
    const { asFragment } = render(<LogoFull />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });

  it('LogoIcon matches snapshot', () => {
    const { asFragment } = render(<LogoIcon />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });

  it('LogoText matches snapshot', () => {
    const { asFragment } = render(<LogoText />);
    removeMantineRandomAttributes();
    expect(asFragment()).toMatchSnapshot();
  });
});
