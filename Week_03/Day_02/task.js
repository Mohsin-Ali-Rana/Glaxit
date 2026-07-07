function createCounter() {
    let count = 0; // Private variable

    function updateDisplay() {
        document.getElementById("count").innerText = count;
    }

    return {
        increment: function () {
            count++;
            updateDisplay();
        },

        decrement: function () {
            count--;
            updateDisplay();
        },

        reset: function () {
            count = 0;
            updateDisplay();
        }
    };
}

let counter = createCounter();