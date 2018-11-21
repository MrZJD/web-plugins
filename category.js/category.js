/**
 * @class Category
 * @desc 分类插件
 */
class Category {
    /**
     * @constructor
     * @param {Node} root 容器节点
     * @param {object} opt 分类参数
     */
    constructor (root, opt) {
        if (!root || !opt) throw new TypeError('You can\'t input a null param')
        this.root = root
        this.opt = opt
        this._clickCbs = {}

        this._list = this._createUl(this.opt)
        this.root.appendChild(this._list)
        this._click()
    }

    /**
     * @private
     * @method _getRandomName
     * @return {string}
     * @desc 生成随机名
     */
    _getRandomName () {
        while (true) {
            let name = '_ct_cb_' + (Math.random() * 10000 >> 0)
            if (!this._clickCbs[name]) return name
        }
    }

    /**
     * @private
     * @method _createUl
     * @param {object} list
     * @return {node}
     * @desc 创建ul列表
     */
    _createUl (list) {
        let ul = document.createElement('ul')
        ul.className = list.className + '-list'

        let frag = document.createDocumentFragment()
        for (let i=0; i<list.cates.length; i++) {
            let item = list.cates[i]
            let li = document.createElement('li')
            li.className = item.className

            if (item.fn) {
                let fnName = this._getRandomName()
                li.innerHTML = `<span class="cate-collapse" data-fn="${fnName}">${item.name}</span>`
                this._clickCbs[fnName] = item.fn
            } else {
                li.innerHTML = `<span class="cate-collapse">${item.name}</span>`
            }

            if (!!item.cates && item.cates.length > 0) {
                li.appendChild(this._createUl(item))
            }

            frag.appendChild(li)
        }
        ul.appendChild(frag)

        setTimeout(() => {
            ul.setAttribute('data-height', ul.clientHeight)
            ul.style.height = ul.clientHeight + 'px'
        })

        return ul
    }

    /**
     * @private
     * @method _click
     * @desc 监听点击
     */
    _click () {
        this.root.addEventListener('click', (evt) => {
            if (evt.target.className.split(' ').indexOf('cate-collapse') !== -1) {
                let fnName = evt.target.getAttribute('data-fn')
                if (!!fnName) { // 点击回调
                    this._clickCbs[fnName].call()
                }

                let list = evt.target.nextSibling
                if (!list) return
                if (list.clientHeight === 0) { // 显隐
                    list.style.height = list.getAttribute('data-height') + 'px'
                } else {
                    list.style.height = '0px'
                }
            }
        })
    }

    /**
     * @public
     * @method refresh
     * @param {object} opt
     * @desc 数据opt刷新
     */
    refresh (opt) {
        if (!!opt) this.opt = opt

        this._clickCbs = {} // 移除已有事件

        let temp = this._createUl(this.opt)
        this.root.replaceChild(temp, this._list)

        this._list = temp
    }
}

if (typeof module !== 'undefined') {
    module.exports = Category
}
