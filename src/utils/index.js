export function formatNumber(input) {
    if (isNaN(input)) {
        return "Invalid input";
    }
    var formattedNumber = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedNumber;
}