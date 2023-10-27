import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { isInCircle } from "../helpers/utils";

@customElement("draggable-dot")
export class DraggableDot extends LitElement {
  @state()
  top?: number = undefined;

  @state()
  left?: number = undefined;

  @property()
  offsetX = 0;

  @property()
  offsetY = 0;

  @property()
  roomHeight = 0;

  @property()
  roomWidth = 0;

  @state()
  dragging = false;

  computeRelativeCoords(top: number, left: number) {
    const offsetFromLeft = (left - this.offsetLeft) / this.roomWidth;
    const offsetFromTop = (top - this.offsetTop) / this.roomHeight;

    return { x: offsetFromLeft, y: offsetFromTop };
  }

  dragStart(e: PointerEvent) {
    this.dragging = true;
    if (e.button !== 0) return;

    // @note: pointer event is legit, although unrecognized by TS
    // @ts-ignore
    e.currentTarget?.setPointerCapture(e.pointerId);
  }

  dragEnd() {
    this.dragging = false;
  }

  dragMove(e: PointerEvent) {
    if (this.dragging) {
      const left = e.ctrlKey
        ? this.left
        : e.clientX - (this.offsetX - window.scrollX);
      const top = e.shiftKey
        ? this.top
        : e.clientY - (this.offsetY - window.scrollY);

      if (!top || !left) return;
      const newPos = this.computeRelativeCoords(top, left);
      if (isInCircle(newPos, { x: 0.5, y: 0.5 }, 0.5)) {
        this.left = left;
        this.top = top;

        this.dispatchEvent(
          new CustomEvent("soundSourceMoved", { detail: newPos, bubbles: true })
        );
      }
    }
  }

  touchStart(e: TouchEvent) {
    e.preventDefault();
  }

  protected render() {
    return html`<div
      style=${styleMap({
        top: `${this.top !== undefined ? this.top + "px" : "50%"}`,
        left: `${this.left !== undefined ? this.left + "px" : "50%"}`,
        height: "1em",
        width: "1em",
        backgroundColor: "var(--foreground-light)",
        borderRadius: "50%",
        position: "absolute",
        transform: "translate(-50%, -50%)",
        cursor: "grab",
      })}
      @pointerdown=${this.dragStart}
      @pointerup=${this.dragEnd}
      @pointermove=${this.dragMove}
      @touchstart=${this.touchStart}
    ></div>`;
  }
}
