import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { memoizedComputeSpeakerOffset } from "../helpers/computeSpeakerOffset";
import { isInCircle, noop } from "../helpers/utils";

import "./room-divider";
import "./room-speaker";
import "./coordinates-display";

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

  updateRoomSize() {
    const circleDiv = this.shadowRoot?.getElementById("main-circle");
    this.roomSize = (circleDiv as HTMLElement).getBoundingClientRect();
  }

  firstUpdated() {
    this.updateRoomSize();

    window.addEventListener("resize", () => {
      this.updateRoomSize();
    });
  }

  checkBoundariesAndDispatch(detail: { x: number; y: number }) {
    if (detail.x < 0 || detail.x > 1 || detail.y < 0 || detail.y > 1) return;

    // @note: Create a slightly greater radius to allow dragging on the edge
    const ADJUSTED_RADIUS = 0.51;

    if (isInCircle(detail, { x: 0.5, y: 0.5 }, ADJUSTED_RADIUS))
      this.dispatchEvent(new CustomEvent("listenerMoved", { detail }));
  }

  handleDrag(e: DragEvent) {
    // @note: Fixes a weird bug where a drag event with a 0 clientX and clientY is fired at the end of a movement
    if (e.clientX === 0 && e.clientY === 0) return;

    const x = (e.clientX - this.roomSize.left) / this.roomSize.width;
    const y = (e.clientY - this.roomSize.top) / this.roomSize.height;

    const detail = { x, y };
    if (e.ctrlKey) detail.x = this.x;

    if (e.shiftKey) detail.y = this.y;

    return this.checkBoundariesAndDispatch(detail);
  }

  // @note: Mobile support
  handleTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    const x = (touch.clientX - this.roomSize.left) / this.roomSize.width;
    const y = (touch.clientY - this.roomSize.top) / this.roomSize.height;

    const detail = { x, y };
    return this.checkBoundariesAndDispatch(detail);
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
    };

    const wrapperStyles = {
      width: `${this.radius}vmax`,
      height: `${this.radius}vmax`,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    return html`
      <section>
        <div style=${styleMap(wrapperStyles)}>
          <div style=${styleMap(circleStyles)} id="main-circle">
            <div
              style=${styleMap({
                top: this.y * 100 + "%",
                left: this.x * 100 + "%",
                height: "1em",
                width: "1em",
                background: "var(--foreground-light)",
                position: "absolute",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                boxSizing: "border-box",
                cursor: "grab",
              })}
              @drag=${this.handleDrag}
              @touchmove=${this.handleTouchMove}
              draggable="true"
            ></div>

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

        <coordinates-display x=${this.x} y=${this.y}></coordinates-display>
      </section>
    `;
  }
}
