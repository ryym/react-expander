/**
 * SizeCalculator calculates width and height
 * corresponding to the cursor positions.
 */
export class SizeCalculator {
  constructor({
    width, height, clientX, clientY
  }) {
    this._start = {
      width, height, clientX, clientY
    };
  }

  calcSizeWhen(clientX, clientY) {
    let { width, height } = this._start;
    width += (clientX - this._start.clientX);
    height += (clientY - this._start.clientY);
    return { width, height };
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
