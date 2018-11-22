;(function () {
    let loader = {
        _module: {
            // 'mname': { isloading: false, isloaded: false }
        },
        require: function (mname, cbFn, loadingFn) {
            let target = this._module[mname]
            if (target && target.isloaded) {
                cbFn() // 已加载
                return
            }
            if (target && target.isloading) {
                // 正在加载
                return
            }

            // 加载失败 或 首次加载
            this._module[mname] = {
                isloading: true,
                isloaded: false,
            }

            loadingFn(true)
            this._loadFile(mname, () => { // 加载完成
                this._module[mname].isloading = false
                loadingFn(false)
                cbFn()
                this._module[mname].isloaded = true
            }, () => { // 加载失败
                this._module[mname].isloading = false
                this._module[mname].isloaded = false

                console.log('[加载失败...]: ', mname)
            })
        },
        _loadFile (url, cb, errFn) {
            let script = document.createElement('script')
            script.src = url
            document.body.appendChild(script)

            script.onload = function () {
                cb()
            }

            script.onerror = function () {
                errFn()
            }
        },
    }

    window.loader = loader
})(window);
