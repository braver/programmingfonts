export default class Cookies {
  get (key) {
    return document.cookie.replace(
      new RegExp(`/(?:(?:^|.*;\\s*)${key}\\s*=\\s*([^;]*).*$)|^.*$/`),
      '$1'
    )
  }

  set (key, value) {
    document.cookie = `${key}=${value};max-age=172800`
  }
}
