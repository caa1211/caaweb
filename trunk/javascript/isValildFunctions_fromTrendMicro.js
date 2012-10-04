function isValidIP(ip, allowStars) {
    if (ip == null || ip == "") return false;
    if (ip.indexOf(".") == -1) return false;
    ipParts = ip.split(".");
    if (ipParts.length != 4) return false;
    var inStars = false;
    for (var i = 0; i < ipParts.length; i++) {
        if (!isValidIPPart(ipParts[i], allowStars)) return false;
        // Can not change to stars and change back to numbers
        if (ipParts[i] == "*") inStars = true;
        if (inStars == true && ipParts[i] != "*") return false;
    }
    return true;
}

function isValidIPMask(ip) {
    if (ip == null) return false;
    if (ip == "") return true;
    if (ip.indexOf(".") == -1) {
        if (isNaN(parseInt(ip, 10))) return false;
        if (parseInt(ip, 10) < 0) return false;
        if (parseInt(ip, 10) > 32) return false;
        return true;
    }
    ipParts = ip.split(".");
    if (ipParts.length != 4) return false;
    for (var i = 0; i < ipParts.length; i++) {
        if (!isValidIPPart(ipParts[i], false)) return false;
    }
    return true;
}

function isValidIPPart(ipPart, allowStars) {
    if (ipPart == null || ipPart == "") return false;
    if (allowStars == true && ipPart == "*") return true;
    if (isNaN(parseInt(ipPart, 10))) return false;
    if (parseInt(ipPart, 10) < 0) return false;
    if (parseInt(ipPart, 10) > 255) return false;
    // Leading zero is not valid on a non zero number
    if (parseInt(ipPart, 10) > 0 && ipPart.substring(0, 1) == "0") return false;
    return true;
}

function isValidPort(port) {
    if (port == null || port == "") return false;
    if (isNaN(parseInt(port, 10))) return false;
    if (parseInt(port, 10) < 0) return false;
    if (parseInt(port, 10) > 65535) return false;
    // Leading zero is not valid on a non zero number
    if (parseInt(port, 10) > 0 && port.substring(0, 1) == "0") return false;
    return true;
}

function isValidPortList(ports) {
    if (ports == null || ports == "") return false;
    if (ports.indexOf(",") == -1 && ports.indexOf("-") == -1) {
        return isValidPort(ports);
    } else if (ports.indexOf(",") == -1) {
        portParts = ports.split("-");
        if (!isValidPort(portParts[0]) || !isValidPort(portParts[1])) return false;
    } else {
        portItems = ports.split(",");
        for (i = 0; i < portItems.length; i++) {
            if (!(portItems[i].indexOf("-") == -1)) {
                portParts = portItems[i].split("-");
                if (!isValidPort(portParts[0]) || !isValidPort(portParts[1])) return false;
            } else {
                if (!isValidPort(portItems[i])) return false;
            }
        }
    }
    return true;
}

function isValidMAC(mac) {
    if (mac == null || mac == "") return false;
    var macParts = mac.split(":");
    if (macParts.length == 1) macParts = mac.split("-");
    if (macParts.length != 6) return false;
    for (var i = 0; i < macParts.length; i++) {
        if (!isHex(macParts[i])) return false;
        if (macParts[i].length != 2) return false;
    }
    return true;
}

function isHex(str) {
    for (var i = 0; i < str.length; i++) {
        if (!isHexChar(str.charAt(i))) return false;
    }
    return true;
}

function isHexChar(c) {
    return (("0123456789abcdefABCDEF".indexOf(c)) >= 0);
}

function isValidFrameNumber(frame) {
    if (frame == null || frame == "") return false;
    if (isNaN(parseInt(frame, 10))) return false;
    if (parseInt(frame, 10) < 0) return false;
    if (parseInt(frame, 10) > 65535) return false;
    // Leading zero is not valid on a non zero number
    if (parseInt(frame, 10) > 0 && frame.substring(0, 1) == "0") return false;
    return true;
}

function isValidFrameNumberHex(frame) {
    if (frame == null || frame == "") return false;
    for (var i = 0; i < frame.length; i++) {
        if (!isHex(frame.substring(i))) return false;
    }
    return true;
}

function isValidProtocolNumber(protocol) {
    if (protocol == null || protocol == "") return false;
    if (isNaN(parseInt(protocol, 10))) return false;
    if (parseInt(protocol, 10) < 0) return false;
    if (parseInt(protocol, 10) > 255) return false;
    // Leading zero is not valid on a non zero number
    if (parseInt(protocol, 10) > 0 && protocol.substring(0, 1) == "0") return false;
    return true;
}

function isValidNumberOfConnections(n) {
    if (n == null || n == "") return false;
    if (isNaN(parseInt(n, 10))) return false;
    if (parseInt(n, 10) < 1) return false;
    if (parseInt(n, 10) > 65535) return false;
    // Leading zero is not valid on a non zero number
    if (parseInt(n, 10) > 0 && n.substring(0, 1) == "0") return false;
    return true;
}

function isValidEmailAddress(email) { // Very basic since we are not using RE's here
    if (email == null || email == "") return false;
    if (email.indexOf("@") == -1) return false;
    if (email.indexOf(".") == -1) return false;
    if (email.length < 5) return false;
    return true;
}