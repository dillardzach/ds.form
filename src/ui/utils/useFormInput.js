import { useEffect, useContext } from 'react'
//import debounce from 'lodash.debounce'

export default (
  fieldName,
  context,
  cleanup,
) => {

  const { getFieldProps } = useContext(context)

  const fieldProps = getFieldProps(fieldName)

  useEffect(() => cleanup ? fieldProps.destroyInput : null, [])

  return fieldProps

}

//https://usehooks.com/useWindowSize/
