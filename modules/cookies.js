export class Cookies {
  static get (key) {
    return document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${key}=`))
      ?.split('=')[1]
  }

  convert (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1)
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  }

  static set (key, value) {
    document.cookie = `${key}=${value};max-age=172800`
  }
}
