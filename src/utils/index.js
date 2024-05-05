export function formatNumber(input) {
    if (isNaN(input)) {
        return 'Invalid input'
    }
    var formattedNumber = input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return formattedNumber
}

export function getTimeDifference(dateTimeString) {
    const now = new Date()
    const past = new Date(dateTimeString)
    const difference = now - past

    const seconds = Math.floor(difference / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) return years + `${years > 1 ? ' years' : ' year'} ago`
    if (months > 0) return months + `${months > 1 ? ' months' : ' month'} ago`
    if (days > 0) return days + `${days > 1 ? ' days' : ' day'} ago`
    if (hours > 0) return hours + `${hours > 1 ? ' hours' : ' hour'} ago`
    if (minutes > 0) return minutes + `${minutes > 1 ? ' minutes' : ' minute'} ago`

    return 'now'
}
