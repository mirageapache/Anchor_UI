import{h as e,i as t,n,s as r,t as i}from"./lit-MXP2jLr5.js";import{m as a,t as o,u as s}from"./decorate-BSUctFxX.js";import{r as c,t as l}from"./live-NNdQTRRa.js";import{n as u,r as d,t as f}from"./heading-YvnLNOwD.js";import{n as p,r as m,t as h}from"./slot-byr6JIFV.js";import{t as g}from"./tag-DIJX3Qfm.js";import{t as _}from"./favorite-btn-t_5TzQ9_.js";import{t as v}from"./rolldown-runtime-Dh6celcD.js";var y;function b(){return(b=v((()=>{i(),y=e`
  :host {
    display: block;
    min-width: 0;
  }

  :host([hidden]),
  [hidden] {
    display: none !important;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm, 8px);
    min-width: 0;
    font-family: var(--font-ui, 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif);
    color: var(--color-text-primary, #0f172a);
  }

  /* ─── 分類標籤與 HOT 徽標 ─── */
  .header__tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-xs, 4px);
  }

  /* ─── 標題列：主標題、收藏鈕與右側操作；空間不足時操作換到下一行，不擠壓標題 ─── */
  .header__title-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--space-sm, 8px);
    min-width: 0;
  }

  /* 標題與收藏鈕為一組，永遠在同一行；標題至少保留 12rem 才與操作並排 */
  .header__title-group {
    display: flex;
    flex: 1 1 12rem;
    align-items: flex-start;
    gap: var(--space-sm, 8px);
    min-width: 0;
  }

  .header__title {
    min-width: 0;
    margin: 0;
    font-size: var(--text-3xl, 1.875rem);
    font-weight: var(--weight-black, 900);
    line-height: var(--leading-tight, 1.25);
    letter-spacing: -0.02em;
    color: var(--color-text-primary, #0f172a);
    overflow-wrap: anywhere;
  }

  /* 收藏鈕對齊標題的第一行（標題換行時不會落在整段的中間）：(第一行行高 − 按鈕高度 32px) / 2 */
  .header__fav {
    flex: 0 0 auto;
    margin-top: calc((var(--text-3xl, 1.875rem) * var(--leading-tight, 1.25) - 32px) / 2);
  }

  /* 右側操作靠右對齊，高度與標題第一行一致以垂直置中 */
  .header__actions {
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm, 8px);
    min-height: calc(var(--text-3xl, 1.875rem) * var(--leading-tight, 1.25));
    margin-inline-start: auto;
  }

  /* ─── 簡述文字 ─── */
  .header__desc {
    margin: 0;
    font-size: var(--text-sm, 0.875rem);
    line-height: var(--leading-normal, 1.5);
    color: var(--color-text-secondary, #475569);
    overflow-wrap: anywhere;
  }
`})))()}var x;function S(){return(S=v((()=>{i(),s(),l(),f(),m(),_(),g(),b(),x=class extends n{static{this.styles=y}constructor(){super(),this.heading=``,this.description=``,this.headingLevel=1,this.hot=!1,this.hotLabel=`HOT`,this.favoritable=!1,this.favorite=!1,this.favoriteLabel=`我的最愛`,this.handleFavoriteChange=e=>{e.stopPropagation();let t=e.detail.favorite;this.favorite=t,this.dispatchEvent(new CustomEvent(`aui-favorite-change`,{detail:{favorite:t},bubbles:!0,composed:!0})),this.favorite!==t&&(e.currentTarget.favorite=this.favorite)},new h(this)}render(){let e=p(this,`tags`),n=!!this.heading||p(this,`heading`),i=p(this,`actions`),a=p(this),o=a||!!this.description,s=n?d(u(this.headingLevel,1),{className:`header__title`,part:`heading`,id:`heading`},r`<slot name="heading">${this.heading}</slot>`):t;return r`
      <div class="header" part="base">
        <div class="header__tags" part="tags" ?hidden=${!e&&!this.hot}>
          <slot name="tags"></slot>
          ${this.hot?r`<aui-tag class="header__hot" part="hot-badge" variant="warning" preserve-case
                  >${this.hotLabel}</aui-tag
                >`:t}
        </div>
        <div class="header__title-row" part="title-row">
          <div class="header__title-group">
            ${s}
            ${this.favoritable?r`<aui-favorite-btn
                    class="header__fav"
                    part="favorite-button"
                    size="lg"
                    label=${this.favoriteLabel}
                    .favorite=${c(this.favorite)}
                    @aui-change=${this.handleFavoriteChange}
                  ></aui-favorite-btn>`:t}
          </div>
          <div class="header__actions" part="actions" ?hidden=${!i}>
            <slot name="actions"></slot>
          </div>
        </div>
        <div class="header__desc" part="description" ?hidden=${!o}>
          <slot></slot>${a?t:this.description}
        </div>
      </div>
    `}},o([a({type:String})],x.prototype,`heading`,void 0),o([a({type:String})],x.prototype,`description`,void 0),o([a({type:Number,attribute:`heading-level`})],x.prototype,`headingLevel`,void 0),o([a({type:Boolean,reflect:!0})],x.prototype,`hot`,void 0),o([a({type:String,attribute:`hot-label`})],x.prototype,`hotLabel`,void 0),o([a({type:Boolean,reflect:!0})],x.prototype,`favoritable`,void 0),o([a({type:Boolean,reflect:!0})],x.prototype,`favorite`,void 0),o([a({type:String,attribute:`favorite-label`})],x.prototype,`favoriteLabel`,void 0),customElements.get(`aui-header`)||customElements.define(`aui-header`,x)})))()}function C(){return(C=v((()=>{S()})))()}export{C as t};