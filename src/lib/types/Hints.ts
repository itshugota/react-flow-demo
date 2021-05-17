import LayoutType from './LayoutType';
import Point from './Point';

export default interface Hints {
  preserveDocking?: string;
  preferredLayouts?: LayoutType[];
  connectionStart?: Point | boolean;
  connectionEnd?: Point | boolean;
}
