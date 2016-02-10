/**
 * SizeCalculator calculates width and height
 * corresponding to the cursor positions.
 */
export class SizeCalculator {
  constructor({
    width, height, clientX, clientY,
    directions = 'bottom right'
  }) {
    this._start = {
      width, height, clientX, clientY
    };
    const { dirX, dirY } = normalizeDirections(directions);
    this._calcs = {
      width: calculators[dirX],
      height: calculators[dirY]
    };
  }

  calcSizeWhen(nextClientX, nextClientY) {
    let { width, height, clientX, clientY } = this._start;
    return {
      width: this._calcs.width(width, clientX, nextClientX),
      height: this._calcs.height(height, clientY, nextClientY)
    };
  }
}

/**
 * The object which has calculation methods
 * of expanding.
 */
export const calculators = {
  top(height, fromY, toY) {
    return height + fromY - toY;
  },

  bottom(height, fromY, toY) {
    return height + toY - fromY;
  },

  left(width, fromX, toX) {
    return width + fromX - toX;
  },

  right(width, fromX, toX) {
    return width + toX - fromX;
  },

  asIs: size => size
};

/**
 * Convert a string which specifies expanding directions
 * to a normalized object..
 * @param {string} directions
 * @returns {Object}
 */
export function normalizeDirections(directions = '') {
  const dirs = directions.split(/\s+/);

  if (dirs.length === 1) {
    const dir = dirs[0];
    const dirY = isDirY(dir) ? dir : 'asIs';
    const dirX = isDirX(dir) ? dir : 'asIs';
    return { dirY, dirX };
  }

  const [d1, d2] = dirs;

  if (isDirY(d1) && isDirY(d2) || isDirX(d1) && isDirX(d2)) {
    throw new Error('Invalid directions are specified.');
  }

  const [dirY, dirX] = isDirY(d1) ? [d1, d2] : [d2, d1];
  return { dirY, dirX };
}

const isDirY = dir => dir === 'top' || dir === 'bottom';
const isDirX = dir => dir === 'left' || dir === 'right';
