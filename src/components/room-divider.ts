import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

type DirectionType = "horizontal" | "vertical";

@customElement("room-divider")
export class RoomDivider extends LitElement {
  @property()
  direction: DirectionType = "horizontal";

  protected render() {
    const isHorizontal = this.direction === "horizontal";

    const styles = {
      backgroundColor: "var(--foreground-dark)",
      position: "absolute",
      width: isHorizontal ? "100%" : "1px",
      height: isHorizontal ? "1px" : "100%",
      left: isHorizontal ? 0 : "50%",
      top: isHorizontal ? "50%" : 0,
      pointerEvents: "none",
    };

    return html`<div style=${styleMap(styles)}></div>`;
  }
}
