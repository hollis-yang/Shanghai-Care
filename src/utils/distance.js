function Rad(d) {
    return d * Math.PI / 180.0;
}

export function getDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = Rad(lat1);
    var radLat2 = Number(Rad(lat2));
    var a = Number(radLat1 - radLat2);
    var b = Rad(lng1) - Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10;
    return s;
}

export function calculateDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    const distance = Math.sqrt(dx*dx + dy*dy);

    return distance / 1000; // 将距离转换为千米
}

export const formatDistance = (dInKm) => {
    if (dInKm < 1) {
        return (dInKm * 1000).toFixed(0) + ' 米'
    } else {
        return dInKm.toFixed(1) + ' 千米'
    }
}