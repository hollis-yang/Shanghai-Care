export function mapRangeToColor(value, min, max, colorMin, colorMax) {
    value = Math.max(min, Math.min(value, max))

    let percent = (value - min) / (max - min)

    // 插值计算颜色
    let colorR = Math.round(colorMin.r + (colorMax.r - colorMin.r) * percent)
    let colorG = Math.round(colorMin.g + (colorMax.g - colorMin.g) * percent)
    let colorB = Math.round(colorMin.b + (colorMax.b - colorMin.b) * percent)

    return `rgba(${colorR},${colorG},${colorB},0.8)`
}