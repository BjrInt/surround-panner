import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

type OrientationType = "left" | "right" | "center";

type SpeakerType = "front" | "surround" | "center";

@customElement("room-speaker")
export class RoomSpeaker extends LitElement {
  @property()
  type: SpeakerType = "front";

  @property()
  angle: number = 0;

  @property()
  orientation: OrientationType = "left";

  @property()
  x: number = 0;

  @property()
  y: number = 0;

  protected render() {
    const styles = {
      borderRadius: "3px",
      width: "3.2vmax",
      height: "2vmax",
      backgroundColor:
        this.type === "center"
          ? "var(--foreground-light)"
          : this.type === "front"
          ? "var(--primary)"
          : "var(--secondary)",
      transform: `translate(-50%, 50%) rotate(${
        this.orientation === "left" ? "-" : ""
      }${this.angle}deg)`,
      position: "absolute",
      bottom: this.y * 100 + 50 + "%",
      left: this.x * 100 + 50 + "%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--background)",
      fontSize: "1vmax",
      fontWeight: "bold",
      textTransform: "uppercase",
    };

    return html`<div style=${styleMap(styles)}>
      ${this.type.charAt(0)}${this.orientation.charAt(0)}
    </div>`;
  }
}
