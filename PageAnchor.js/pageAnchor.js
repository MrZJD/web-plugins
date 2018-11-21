/**
 * @class PageAnchor
 * @desc 页面锚点管理
 */
class PageAnchor {
    /**
     * @constructor
     * @param {Node} btnRoot 按钮根节点
     * @param {[Node]} targets 目标节点
     */
    constructor (btnRoot, targets) {
        this.btnRoot = btnRoot
        this.targets = targets

        this._btns = [].slice.call(this.btnRoot.querySelectorAll('[anchor-src]'))
        this._Ys = {}
        this._lock = false // 判断是用户滚动 还是程序滚动

        this._init()
    }

    /**
     * @private
     * @method _init
     * @desc 初始化
     */
    _init () {
        this.targets.forEach(t => {
            let anchor = t.getAttribute('anchor')
            if (!anchor) {
                return
            }

            this._Ys[anchor] = {
                y: t.offsetTop,
                target: t,
                btn: this._btns.find(btn => {
                    return btn.getAttribute('anchor-src') === anchor
                }),
            }
        })

        this.btnRoot.addEventListener('click', (evt) => {
            let to = evt.target.getAttribute('anchor-src')
            if (to) {
                this.scrollTo(to)
            }
        })

        this._scrollTimer = null
        document.addEventListener('scroll', (evt) => {
            // throttle
            clearTimeout(this._scrollTimer)

            if (this._lock) return

            this._scrollTimer = setTimeout(() => {
                this.refreshBtn()
            }, 100)
        })

        this.refreshBtn()
    }

    /**
     * @public
     * @method refreshBtn
     * @desc 滚轮滚动时刷新按钮状态
     */
    refreshBtn () {
        let top = document.documentElement.scrollTop || document.body.scrollTop

        let currY = 0
        let currKey = ''
        let tempY = -200 // 距离顶部距离
        Object.keys(this._Ys).forEach(key => {
            let anchor = this._Ys[key]
            if (top - anchor.y >= tempY && anchor.y >= currY) {
                currY = anchor.y
                currKey = key
            }
        })

        this._setActiveBtn(currKey)
    }

    /**
     * @public
     * @param {*} currKey
     * @desc 设置当前滚动的位置所在的按钮样式
     */
    _setActiveBtn (currKey) {
        Object.keys(this._Ys).forEach(key => {
            let anchor = this._Ys[key]
            if (key === currKey) {
                anchor.btn.className.indexOf(' active') === -1 ? (anchor.btn.className += ' active') : ''
            } else {
                anchor.btn.className = anchor.btn.className.split(' ').filter(val => val !== 'active').join(' ')
            }
        })
    }

    /**
     * @private
     * @method _timeFn
     * @param {*} t 当前时间
     * @param {*} b 初始值
     * @param {*} c 变化量
     * @param {*} d 持续值
     * @return {*}
     * @desc 缓动函数
     */
    _timeFn (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b
        return -c / 2 * ((--t) * (t-2) - 1) + b
    }

    /**
     * @private
     * @method scrollTo
     * @param {string} to
     * @desc 滚动到指定节点位置
     */
    scrollTo (to) {
        if (!this._Ys[to]) return

        this._setActiveBtn(to)
        this._lock = true

        let target = this._Ys[to].y
        let start = Date.now()
        let duration = 300 // 持续时间
        let top = document.documentElement.scrollTop || document.body.scrollTop
        let change = target - top

        let scroll = () => { // eslint-disable-line
            if (!this._lock) return

            let curr = Date.now() - start
            let resTop = this._timeFn(curr, top, change, duration) // eslint-disable-line

            document.documentElement.scrollTop = resTop
            document.body.scrollTop = resTop

            if (curr < duration) {
                requestAnimationFrame(scroll)
            } else {
                setTimeout(() => {
                    document.documentElement.scrollTop = target
                    document.body.scrollTop = target

                    setTimeout(() => {
                        this._lock = false
                    })
                })
            }
        }

        requestAnimationFrame(scroll)
    }
}

if (typeof module !== 'undefined') {
    module.exports = PageAnchor
}
