import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { computeSpeakerLevels } from "../helpers/computeSpeakerLevels";
import { memoizedComputeSpeakerOffset } from "../helpers/computeSpeakerOffset";
import { uncamel } from "../helpers/utils";

@customElement("side-panel")
export class SidePanel extends LitElement {
  @property()
  frontOffset: number = 30;

  @property()
  surroundOffset: number = 110;

  @property()
  x: number = 0.5;

  @property()
  y: number = 0.5;

  @state()
  displayOptions = true;

  toggleOptions() {
    this.displayOptions = !this.displayOptions;
  }

  handleOffsetChange(location: keyof this, e: Event) {
    const value = (e.target as HTMLInputElement).valueAsNumber;

    this[location as keyof this] = value as this[keyof this];
    this.dispatchEvent(
      new CustomEvent("offsetChanged", {
        detail: {
          frontOffset: this.frontOffset,
          surroundOffset: this.surroundOffset,
        },
      })
    );
  }

  static styles = css`
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      background: transparent;
      cursor: pointer;
      width: 15rem;
    }

    input[type="range"]:focus {
      outline: none;
    }

    /***** Chrome, Safari, Opera and Edge Chromium styles *****/
    /* slider track */
    input[type="range"]::-webkit-slider-runnable-track {
      background-color: var(--foreground-dark);
      border-radius: 0.5rem;
      height: 0.5rem;
    }

    /* slider thumb */
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;
      margin-top: -0.25rem; /* Centers thumb on the track */

      /*custom styles*/
      background-color: var(--foreground-light);
      height: 1rem;
      width: 1rem;
      border-radius: 0.5rem;
    }

    input[type="range"]:focus::-webkit-slider-thumb {
      border: 1px solid var(--foreground-dark);
      outline: 2px solid var(--primary);
    }

    /******** Firefox styles ********/
    /* slider track */
    input[type="range"]::-moz-range-track {
      background-color: var(--foreground-light);
      border-radius: 0.5rem;
      height: 0.5rem;
    }

    /* slider thumb */
    input[type="range"]::-moz-range-thumb {
      border: none; /*Removes extra border that FF applies*/

      /*custom styles*/
      border-radius: 0.5rem; /*Removes default border-radius that FF applies*/
      background-color: var(--foreground-dark);
      height: 1rem;
      width: 1rem;
    }

    input[type="range"]:focus::-moz-range-thumb {
      border: 1px solid var(--foreground-light);
      outline: 2px solid var(--primary);
    }

    .foldable {
      cursor: pointer;
      border-radius: 1em;
      transition: 0.5s;

      &:hover {
        background-color: var(--background-darker);
      }
    }

    h2 {
      padding: 0.5em 0.25em;
    }

    ul,
    li {
      list-style: none;
      padding: 0;

      & > span {
        text-transform: capitalize;
      }
    }

    .range-wrapper {
      padding: 0.5em 0;
    }
  `;

  protected render() {
    const levels = computeSpeakerLevels(
      { x: this.x, y: 1 - this.y },
      memoizedComputeSpeakerOffset(this.frontOffset, this.surroundOffset)
    );
    return html`<section>
      <h2 @click=${this.toggleOptions} class="foldable">
        <span>${this.displayOptions ? "-" : "+"}</span>
        Options
      </h2>

      ${this.displayOptions
        ? html` <div>
            <div class="range-wrapper">
              <div>Front speakers angle (${this.frontOffset}°)</div>
              <input
                type="range"
                min="0"
                max="90"
                value=${this.frontOffset}
                @input=${(e: Event) =>
                  this.handleOffsetChange("frontOffset", e)}
              />
            </div>

            <div class="range-wrapper">
              <div>Surround speakers angle (${this.surroundOffset}°)</div>
              <input
                type="range"
                min="90"
                max="180"
                value=${this.surroundOffset}
                @input=${(e: Event) =>
                  this.handleOffsetChange("surroundOffset", e)}
              />
            </div>
          </div>`
        : html`<div></div>`}

      <h2>Volumes</h2>

      <div>
        <ul>
          ${Object.entries(levels).map(([name, level]) => {
            return html`<li>
              <span>${uncamel(name)}:</span>
              <strong>${level.toFixed(2)}</strong> dB
            </li>`;
          })}
        </ul>
      </div>
    </section>`;
  }
}
