export default (p, n)  => {
  if(p.value != n.value) return false
  if(p.errors != n.errors) return false
  //if(p.onChange != n.onChange) return false
  //if(p.setInputValue != n.setInputValue) return false
  /*
  if(n.options && n.options.length) {
    if(p.options && p.options.length) return p.options.length > n.options.length
  }*/
  return true
}
