export function escapeSpecialChars(str: string | undefined) {
  return str?.replace(/[\n\t\r\\]/g, (match) => {
    switch (match) {
      case '\n': return '\\n'
      case '\t': return '\\t'
      case '\r': return '\\r'
      case '\\': return '\\\\'
      default: return match
    }
  })
}
