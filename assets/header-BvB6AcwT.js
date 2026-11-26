import{n as e}from"./rolldown-runtime-sJBDdmOt.js";import{h as t,i as n,n as r,s as i,t as a}from"./lit-DvaG8Cmk.js";import{t as o,u as s,v as c}from"./decorate-B5jhCMz7.js";import{r as l,t as u}from"./live-CDwuZPw1.js";import{n as d,r as f,t as p}from"./heading-CK0tPUd9.js";import{n as m,r as h,t as g}from"./slot-BP5G2qTd.js";import{t as _}from"./favorite-btn-4JM-Y1zR.js";import{t as v}from"./tag-Bto1ggSY.js";var y;function b(){return(b=e((()=>{a(),y=t`
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
`})))()}var x;function S(){return(S=e((()=>{a(),s(),u(),p(),h(),_(),v(),b(),x=class extends r{static{this.styles=y}constructor(){super(),this.heading=``,this.description=``,this.headingLevel=1,this.hot=!1,this.hotLabel=`HOT`,this.favoritable=!1,this.favorite=!1,this.favoriteLabel=`我的最愛`,this.handleFavoriteChange=e=>{e.stopPropagation();let t=e.detail.favorite;this.favorite=t,this.dispatchEvent(new CustomEvent(`aui-favorite-change`,{detail:{favorite:t},bubbles:!0,composed:!0})),this.favorite!==t&&(e.currentTarget.favorite=this.favorite)},new g(this)}render(){let e=m(this,`breadcrumb`),t=m(this,`tags`),r=!!this.heading||m(this,`heading`),a=m(this,`actions`),o=m(this),s=o||!!this.description,c=r?f(d(this.headingLevel,1),{className:`header__title`,part:`heading`,id:`heading`},i`<slot name="heading">${this.heading}</slot>`):n;return i`
      <div class="header" part="base">
        <div class="header__breadcrumb" part="breadcrumb" ?hidden=${!e}>
          <slot name="breadcrumb"></slot>
        </div>
        <div class="header__tags" part="tags" ?hidden=${!t&&!this.hot}>
          <slot name="tags"></slot>
          ${this.hot?i`<aui-tag class="header__hot" part="hot-badge" variant="warning"
                  >${this.hotLabel}</aui-tag
                >`:n}
        </div>
        <div class="header__title-row" part="title-row">
          <div class="header__title-group">
            ${c}
            ${this.favoritable?i`<aui-favorite-btn
                    class="header__fav"
                    part="favorite-button"
                    size="lg"
                    label=${this.favoriteLabel}
                    .favorite=${l(this.favorite)}
                    @aui-change=${this.handleFavoriteChange}
                  ></aui-favorite-btn>`:n}
          </div>
          <div class="header__actions" part="actions" ?hidden=${!a}>
            <slot name="actions"></slot>
          </div>
        </div>
        <div class="header__desc" part="description" ?hidden=${!s}>
          <slot></slot>${o?n:this.description}
        </div>
      </div>
    `}},o([c({type:String})],x.prototype,`heading`,void 0),o([c({type:String})],x.prototype,`description`,void 0),o([c({type:Number,attribute:`heading-level`})],x.prototype,`headingLevel`,void 0),o([c({type:Boolean,reflect:!0})],x.prototype,`hot`,void 0),o([c({type:String,attribute:`hot-label`})],x.prototype,`hotLabel`,void 0),o([c({type:Boolean,reflect:!0})],x.prototype,`favoritable`,void 0),o([c({type:Boolean,reflect:!0})],x.prototype,`favorite`,void 0),o([c({type:String,attribute:`favorite-label`})],x.prototype,`favoriteLabel`,void 0),customElements.get(`aui-header`)||customElements.define(`aui-header`,x)})))()}function C(){return(C=e((()=>{S()})))()}export{C as t};