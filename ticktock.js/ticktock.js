/**
 * @class TickTock
 * @desc js定时器
 * @description 指定开始时间-结束时间 区间内进行倒计时 指定时间点运行,每秒运行,结束运行
 */
class TickTock {
    /**
     * @constructor
     * @param {string} name 定时器标识名称
     * @param {string} type 运行类型: ['timer', 'counter'] timer定时器 counter倒计时器
     */
    constructor(name, type) {
        this._name = name || ''
        this._type = type || 'timer'
        this._timer = null

        this._evts = {
            'tick': [],
            'timer': [],
            'end': [],
        }
    }

    /**
     * @public
     * @method start
     * @param {string} sTime 开始时间 _服务器时间
     * @param {string} eTime 结束时间
     * @desc 开始运行定时器
     */
    start (sTime, eTime) {
        if (this._type !== 'timer') {
            console.log('[Your TimeCounter is NOT timer]:', this._type)
            return
        }

        this._sTime = new Date(sTime.replace(/-/g, '/')).getTime()
        this._eTime = new Date(eTime.replace(/-/g, '/')).getTime()

        this._startTime = Date.now()

        // 清除所有过期的time
        let timers = this._evts['timer']

        let nextTimers = []
        for (let i=0; i<timers.length; i++) {
            if (timers[i].time > this._sTime) {
                nextTimers.push(timers[i])
            }
        }
        this._evts['timer'] = nextTimers

        console.log('[Debug: StartTimer]:', this._name)
        this._run()
    }

    /**
     * @private
     * @method _run
     * @desc 开始运行 主逻辑
     */
    _run () {
        let now = Date.now()
        let passed = now - this._startTime
        let serverNow = this._sTime + passed // 与指定时间保持同步 (原因:本地时间与服务器时间存在差值)
        let lefted = this._eTime - serverNow

        let data = {
            now: serverNow,
            lefted: lefted,
        }

        if (lefted <= 0) {
            // 结束触发
            this._trigger('end', data)
            // 清零
            this.stop()
        } else {
            // 到点触发
            this._checkHandler(data)

            // 每秒触发
            this._trigger('tick', data)

            // 继续倒计时
            this._timer = setTimeout(this._run.bind(this), 1000)
        }
    }

    /**
     * @private
     * @method _checkHandler
     * @param {*} data
     * @desc 到点触发器
     */
    _checkHandler (data) {
        let timers = this._evts['timer']
        if (timers.length === 0) return

        let nextTimers = []
        for (let i=0; i<timers.length; i++) {
            let currTimer = timers[i]

            if (currTimer.time <= data.now) {
                currTimer.fn.call(currTimer.ctx, data)
            } else {
                nextTimers.push(currTimer)
            }
        }

        this._evts['timer'] = nextTimers
    }

    /**
     * @private
     * @method _trigger
     * @param {string} evtType
     * @param {object} data
     * @desc 触发对应的handler
     */
    _trigger (evtType, data) {
        let handlers = this._evts[evtType]
        if (!handlers && handlers.length === 0) return

        handlers.forEach(h => {
            h.fn.call(h.ctx, data)
        })
    }

    /**
     * @private
     * @method _register
     * @param {string} evtType
     * @param {func} fn
     * @param {ctx} ctx
     * @return {string} handlerId
     */
    _register (evtType, fn, ctx) {
        let handlerId = evtType + '_' + Date.now()
        this._evts[evtType].push({
            name: handlerId,
            fn: fn,
            ctx: ctx,
        })
        return handlerId
    }

    /**
     * @public
     * @method stop
     * @desc 停止定时器
     */
    stop () {
        console.log('[Debug: StopTimer]:', this._name)
        this._timer && clearTimeout(this._timer)
        this._timer = null
    }

    /**
     * @public
     * @method stopTick
     * @desc 移除所有tick事件监听
     */
    stopTick () {
        if (this._evts['tick'].length > 0) {
            this._evts['tick'] = []
        }
    }

    /**
     * @public
     * @method count
     * @param {number} seconds
     * @desc 运行倒计时
     */
    count (seconds) {
        if (this._type !== 'counter') {
            console.log('[Your TimeCounter is NOT counter]:', this._type)
            return
        }

        let now = Date.now()
        this._sTime = now
        this._eTime = now + seconds*1000

        this._startTime = now

        console.log('[Debug: StartTimer]:', this._name)
        this._run()
    }

    /**
     * @public
     * @method whenTick
     * @param {func} fn
     * @param {obj} ctx
     * @return {string} handlerId
     * @desc 注册tick事件
     */
    whenTick (fn, ctx) {
        return this._register('tick', fn, ctx)
    }

    /**
     * @public
     * @method whenEnd
     * @param {func} fn
     * @param {obj} ctx
     * @desc 注册tick事件
     * @return {string} handlerId
     */
    whenEnd (fn, ctx) {
        return this._register('end', fn, ctx)
    }

    /**
     * @public
     * @method when
     * @param {string} time
     * @param {func} fn
     * @param {obj} ctx
     * @desc 倒计时剩余时间为time时 有且只触发一次 -> 如果7min注册一次, 5min注册一次, 开始倒计时为4min则只会触发5min, 就近原则
     * @return {string} handlerId
     */
    when (time, fn, ctx) {
        let handlerId = 'timer_' + Date.now()
        this._evts['timer'].push({
            time: typeof time === 'string' ? new Date(time.replace(/-/g, '/')).getTime() : time,
            name: handlerId,
            fn: fn,
            ctx: ctx,
        })
        return handlerId
    }
}

module.exports = TickTock
