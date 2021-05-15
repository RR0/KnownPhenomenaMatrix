import common, {Context, SelectorDirective} from "common"

class Rr0Tweet extends SelectorDirective {

  constructor() {
    super(".rr0-tweet")
    const fjs = document.getElementsByTagName('script')[0]
    const frag = document.createDocumentFragment()
    const js = document.createElement('script')
    js.src = '//platform.twitter.com/widgets.js'
    frag.appendChild(js)
    fjs.parentNode.insertBefore(frag, fjs)
  }

  protected handle(context: Context, el: HTMLElement) {
    el.innerHTML = '<a href="https://twitter.com/share" class="twitter-share-button" data-count="horizontal">Tweet</a>'
  }
}

const rr0Tweet = new Rr0Tweet()
common.directives.push(rr0Tweet)
