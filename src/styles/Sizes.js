import {PixelRatio} from 'react-native';

const Sizes = {
  BASE: 13,
  ONE_PIXEL: 1 /  PixelRatio.get(),
  NAVIGATOR_HEIGHT: 64,
  LIGHT: '300',
  REGULAR: '400',
  MEDIUM: '500',
  BOLD: '600',

  SUBHEADER_FONT_SIZE: 17,

  NB_TABS: 5,
};

export default Object.freeze(Sizes);
