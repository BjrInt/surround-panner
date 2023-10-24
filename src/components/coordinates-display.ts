import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { normalizedPosition } from "../helpers/utils";

@customElement("coordinates-display")
export class CoordinatesDisplay extends LitElement {
  @property()
  x: number = 0.5;

  @property()
  y: number = 0.5;

  static styles = css`
    div {
      font-size: 1.3vmax;
      text-align: center;
      /* @note: The coordinates should override the surround speakers in case of overlap */
      position: relative;
      background: var(--background);
      padding: 0.5em;
      z-index: 200;
    }
  `;

  protected render() {
    return html`<div>
      (${normalizedPosition(this.x).toFixed(2)},
      ${normalizedPosition(1 - this.y).toFixed(2)})
    </div>`;
  }
}
