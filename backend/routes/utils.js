module.exports = {
    countDecimals: function (value) {
        if (Math.floor(value) === value) return 0;
        return value.toString().split(".")[1].length || 0;
    },
    // https://stackoverflow.com/questions/18719775/parsing-and-converting-exponential-values-to-decimal-in-javascript
    noExponents: function (value) {
        var data = String(value).split(/[eE]/);
        if (data.length == 1) return data[0];

        var z = '', sign = value < 0 ? '-' : '',
            str = data[0].replace('.', ''),
            mag = Number(data[1]) + 1;

        if (mag < 0) {
            z = sign + '0.';
            while (mag++) z += '0';
            return z + str.replace(/^\-/, '');
        }
        mag -= str.length;
        while (mag--) z += '0';
        return str + z;
    }
}