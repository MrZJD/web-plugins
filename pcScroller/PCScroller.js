/**
 * @class PCScroller
 * @desc pc端滚动条样式优化
 */
class PCScroller {
    /**
     * @constructor
     * @param {Node} root 滚动节点
     */
    constructor (root) {
        this.node = root
        this.ss = null
        this.ssThumb = null

        this.draging = false
        this.boxSize = {
            height: this.node.scrollHeight,
            clientHeight: this.node.clientHeight,
            h: this.node.scrollHeight - this.node.clientHeight,
            top: 0,
            ssTop: 0,
            ssHeight: 60, // 默认滚动条高度
        }

        this._init()

        if (!PCScroller._inited) {
            document.body.addEventListener('mouseup', () => {
                PCScroller._scrollers.forEach(item => {
                    item.draging = false
                })
            })
            PCScroller._inited = true
        }
        PCScroller._scrollers.push(this)
    }

    /**
     * @private
     * @method _init
     * @desc 初始化
     */
    _init () {
        let ss = document.createElement('div')
        ss.className = 'scroller-container'
        let ssThumb = document.createElement('div')
        ssThumb.className = 'scroller-thumb'

        ss.appendChild(ssThumb)
        this.node.appendChild(ss)

        this.ss = ss
        this.ssThumb = ssThumb
        this._isFF = typeof this.node.onmousewheel === 'undefined' // firefox unsupport event 'onmousewheel'

        this._reset()

        this._addMWEvent(this.node, this._scroll)
        this._addDragEvent(this.ssThumb)
    }

    /**
     * @private
     * @method _reset
     * @desc 默认滚动条样式置空
     */
    _reset () {
        this.node.style.overflow = 'hidden'
        this.node.style.position = 'relative'
    }

    /**
     * @private
     * @method _scroll
     * @param {event} evt
     * @desc onmousewheel 事件处理: node滚动位置scrollTop滚动
     * @return {void}
     */
    _scroll (evt) {
        // this.boxSize.top -= evt.wheelDeltaY
        let delta = -1
        if (this._isFF) {
            if (evt.detail > 0) {
                delta = 1
            }
        } else {
            if (evt.wheelDelta < 0) {
                delta = 1
            }
        }
        this.boxSize.top += 40 * delta

        if (this.boxSize.top <= 0) {
            this.boxSize.top = 0
        } else if (this.boxSize.top >= this.boxSize.h) {
            this.boxSize.top = this.boxSize.h
        } else {
            evt.preventDefault()
            evt.stopPropagation()
            evt.cancelBubble = true
        }

        this.boxSize.ssTop = (this.boxSize.top / this.boxSize.h) * (this.ss.clientHeight - this.boxSize.ssHeight)

        this._refresh()

        return false
    }

    /**
     * @private
     * @param {event} evt
     * @desc 拖拽滚动滑块处理方法
     */
    _dragScroller (evt) {
        if (!this.draging) return

        let deltaY = evt.pageY - this.dragSY // 滚动差值
        this.dragSY = evt.pageY

        this.boxSize.ssTop += deltaY

        if (this.boxSize.ssTop <= 0) {
            this.boxSize.ssTop = 0
        }

        let maxH = this.ss.clientHeight - this.boxSize.ssHeight
        if (this.boxSize.ssTop >= maxH) {
            this.boxSize.ssTop = maxH
        }

        // 计算百分比
        this.boxSize.top = (this.boxSize.ssTop / (this.ss.clientHeight - this.boxSize.ssHeight)) * this.boxSize.h

        this._refresh()
    }

    /**
     * @private
     * @method _refresh
     * @desc 滚动条位置刷新
     */
    _refresh () {
        if (this.boxSize.clientHeight >= this.boxSize.height) {
            this.ssThumb.style.display = 'none'
        } else {
            this.ssThumb.style.display = 'block'
        }
        // console.log(this.boxSize)
        this.node.scrollTop = this.boxSize.top
        this.ss.style.top = this.boxSize.top + 'px'
        this.ssThumb.style.top = this.boxSize.ssTop + 'px'
    }

    /**
     * @private
     * @method_addMWEvent
     * @param {Node} element
     * @param {func} func
     * @desc 监听鼠标滚动
     */
    _addMWEvent (element, func) {
        let self = this
        if (!this._isFF) {
            element.onmousewheel = function (evt) {
                func.call(self, evt)
            }
        }

        if (this._isFF) {
            element.addEventListener('DOMMouseScroll', function (evt) {
                console.log(evt)
                func.call(self, evt)
            }, false)
        }
    }

    /**
     * @private
     * @method _addDragEvent
     * @param {Node} element
     * @desc 监听滚动滑块拖动
     */
    _addDragEvent (element) {
        element.addEventListener('mousedown', (evt) => {
            this.draging = true
            this.dragSY = evt.pageY
        })
        element.addEventListener('mouseup', () => {
            this.draging = false
        })

        element.addEventListener('mousemove', this._dragScroller.bind(this))
        document.body.addEventListener('mousemove', this._dragScroller.bind(this))
    }

    /**
     * @public
     * @method refreshDOM
     * @desc 当内部元素发生变化时，应调用此方法刷新滚动位置
     */
    refreshDOM () {
        this.draging = false
        this.boxSize.height = this.node.scrollHeight
        this.boxSize.clientHeight = this.node.clientHeight
        this.boxSize.h = this.node.scrollHeight - this.node.clientHeight

        this.boxSize.ssTop = (this.boxSize.top / this.boxSize.h) * (this.ss.clientHeight - this.boxSize.ssHeight)

        this._refresh()
    }
}

PCScroller._scrollers = []
PCScroller._inited = false

if (typeof module !== 'undefined') {
    module.exports = PCScroller
}
