import { LitElement, css, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./components/surround-room";
import "./components/side-panel";

@customElement("app-root")
export class AppRoot extends LitElement {
  @state()
  offsets = {
    frontOffset: 30,
    surroundOffset: 110,
  };

  @state()
  soundSource = {
    x: 0.5,
    y: 0.5,
  };

  moveSoundSource(e: CustomEvent<{ x: number; y: number }>) {
    this.soundSource = e.detail;
  }

  offsetChangeListener(
    e: CustomEvent<{ frontOffset: number; surroundOffset: number }>
  ) {
    this.offsets = e.detail;
  }

  static styles = css`
    main {
      display: flex;
      flex-wrap: wrap;
    }

    main > div {
      padding: 2.5vh 2.5vw;
      &:not(:first-child) {
        border-left: 1px solid var(--foreground-dark);
      }
    }

    @media screen and (max-width: 768px) {
      main > div {
        padding: 2vh 0;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;

        &:not(:first-child) {
          border-left: none;
          border-top: 1px solid var(--foreground-dark);
        }
      }

      .no-mobile {
        display: none;
      }
    }
  `;

  render() {
    return html`
      <h1>Surround Panner</h1>

      <p>
        Drag the dot accross the screen to position the sound source between the
        speakers
      </p>

      <p class="no-mobile">
        <strong>Tip: </strong> Hold <kbd>shift</kbd> to lock Y-axis or
        <kbd>ctrl</kbd> to lock X-axis
      </p>

      <main>
        <div>
          <surround-room
            radius="30"
            frontOffset=${this.offsets.frontOffset}
            surroundOffset=${this.offsets.surroundOffset}
            x=${this.soundSource.x}
            y=${this.soundSource.y}
            @soundSourceMoved=${this.moveSoundSource}
          ></surround-room>
        </div>

        <div>
          <side-panel
            x=${this.soundSource.x}
            y=${this.soundSource.y}
            frontOffset=${this.offsets.frontOffset}
            surroundOffset=${this.offsets.surroundOffset}
            @offsetChanged=${this.offsetChangeListener}
          >
          </side-panel>
        </div>
      </main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-root": AppRoot;
  }
}
