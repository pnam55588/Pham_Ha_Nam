var sum_to_n_a = function(n) {
    let result = 0;
    for(let i = 0; i <= n; i++) {
        result += i;
    }
    return result;
};

var sum_to_n_b = function(n) {
    return n * (n + 1) / 2;
};

var sum_to_n_c = function(n) {
    if(n <= 1) {
        return n;
    }
    return n + sum_to_n_c(n - 1);
};

