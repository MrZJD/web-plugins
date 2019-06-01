/**
 * chalk plugin for browser consoles
 * @author mrzjd
 */

(function ($window, $console) {
    // default styles
    const stylesMap = new Map() // key -> function name / value -> style value

    // 基础色值
    stylesMap.set('red', 'color: red;')
    stylesMap.set('green', 'color: green;')
    stylesMap.set('blue', 'color: #005caf;')

    // label
    stylesMap.set('_red', 'background-color: red; color: #fff; border-radius: 2px; padding: 0px 4px;')
    stylesMap.set('_green', 'background-color: green; color: #fff; border-radius: 2px; padding: 0px 4px;')
    stylesMap.set('_blue', 'background-color: #005caf; color: #fff; border-radius: 2px; padding: 0px 4px;')

    // console.chalk
    let log = function (...args) {
        let st = args.reduce((prev, curr) => {
            if (curr instanceof ChalkStyle) {
                prev.styleText.push(curr.str)
                prev.styleOption.push(curr.style)
            } else {
                prev.normalText.push(curr)
            }

            return prev
        }, {
            styleText: [],
            styleOption: [],
            normalText: [],
        })
        return console.log(st.styleText.join(' '), ...st.styleOption, ...st.normalText)
    }

    // * @class Chalk
    let Chalk = function () {}
    let ChalkStyle = function (str, style) {
        this.str = str
        this.style = style
    }

    function isString (str) {
        if (!(typeof str === 'string')) {
            return false
        }
        return true
    }

    Chalk.prototype.defineStyle = function (key, style) {
        Object.defineProperty(Chalk.prototype, key, {
            value: function (str) {
                return isString(str) ? new ChalkStyle(`%c${str}`, style) : str
            },
        })
    }

    // binding
    $window.chalk = new Chalk()
    $console.chalk = log

    // connect default styles
    stylesMap.forEach((style, key) => {
        $window.chalk.defineStyle(key, style)
    })
})(window, console);
