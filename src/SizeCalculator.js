/**
 * SizeCalculator calculates width and height
 * corresponding to the cursor positions.
 */
export default class SizeCalculator {
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
