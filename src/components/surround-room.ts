import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { memoizedComputeSpeakerOffset } from "../helpers/computeSpeakerOffset";
import { noop } from "../helpers/utils";

import "./room-divider";
import "./room-speaker";
import "./coordinates-display";
import "./draggable-dot";

@customElement("surround-room")
export class Room extends LitElement {
  @property()
  x: number = 0.5;

  @property()
  y: number = 0.5;

  @property()
  radius: number = 25;

  @property()
  frontOffset: number = 30;

  @property()
  surroundOffset: number = 110;

  @state()
  roomSize: DOMRect = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    toJSON: noop,
  };

  moveSoundSource(e: CustomEvent<{ x: number; y: number }>) {
    this.x = e.detail.x;
    this.y = e.detail.y;

    // @note: There might be a better way to stream an event to an higher order component
    this.dispatchEvent(
      new CustomEvent("surroundRoomPositionChanged", { detail: e.detail })
    );
  }

  updateRoomSize() {
    const circleDiv = this.shadowRoot?.getElementById("main-circle");
    this.roomSize = (circleDiv as HTMLElement).getBoundingClientRect();
  }

  firstUpdated() {
    this.updateRoomSize();

    window.addEventListener("resize", () => {
      this.updateRoomSize();
    });

    // @fixme: For some reason, the room size is not updated on the first render
    // This is a temporary fix
    // @note: Check lit lifecycle hooks
    setTimeout(() => {
      this.updateRoomSize();
    }, 100);
  }

  protected render() {
    const speakerPositions = memoizedComputeSpeakerOffset(
      this.frontOffset,
      this.surroundOffset
    );

    const circleStyles = {
      width: `${this.radius - 2}vmax`,
      height: `${this.radius - 2}vmax`,
      borderRadius: "50%",
      border: "3px solid var(--foreground-dark)",
      position: "relative",
      margin: "0",
      padding: "0",
      boxSizing: "border-box",
    };

    const wrapperStyles = {
      width: `${this.radius}vmax`,
      height: `${this.radius}vmax`,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
    };

    return html`
      <section>
        <div style=${styleMap(wrapperStyles)}>
          <div style=${styleMap(circleStyles)} id="main-circle">
            <draggable-dot
              offsetX=${this.roomSize.left}
              offsetY=${this.roomSize.top}
              roomWidth=${this.roomSize.width}
              roomHeight=${this.roomSize.height}
              x=${this.x}
              y=${this.y}
              @soundSourceMoved=${this.moveSoundSource}
            ></draggable-dot>

            <room-divider direction="horizontal"></room-divider>
            <room-divider direction="vertical"></room-divider>
          </div>
          <room-speaker
            type="center"
            x=${speakerPositions.center.x}
            y=${speakerPositions.center.y}
            angle="0"
            orientation="center"
          ></room-speaker>

          <room-speaker
            type="front"
            x=${speakerPositions.frontLeft.x}
            y=${speakerPositions.frontLeft.y}
            angle=${this.frontOffset}
            orientation="left"
          ></room-speaker>

          <room-speaker
            type="front"
            x=${speakerPositions.frontRight.x}
            y=${speakerPositions.frontRight.y}
            angle=${this.frontOffset}
            orientation="right"
          ></room-speaker>

          <room-speaker
            type="surround"
            x=${speakerPositions.surroundLeft.x}
            y=${speakerPositions.surroundLeft.y}
            angle=${this.surroundOffset}
            orientation="left"
          >
          </room-speaker>

          <room-speaker
            type="surround"
            x=${speakerPositions.surroundRight.x}
            y=${speakerPositions.surroundRight.y}
            angle=${this.surroundOffset}
            orientation="right"
          >
          </room-speaker>
        </div>

        <coordinates-display
          x=${this.x}
          y=${this.y}
          @coordinatesChanged=${this.moveSoundSource}
        ></coordinates-display>
      </section>
    `;
  }
}
