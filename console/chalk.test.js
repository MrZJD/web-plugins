if (!console.chalk) {
    throw new Error('chalk not implement')
}

const {red, green, blue, _red, _green, _blue} = chalk

console.chalk(red('RED'), _red('RED LABEL'))
console.chalk(green('GREEN'), _green('GREEN LABEL'))
console.chalk(blue('BLUE'), _blue('BLUE LABEL'))
