import { useReducer, useEffect, useCallback } from 'react'
import debounce from 'lodash.debounce'

const objectPrefix = `obj-`

const getRandomId = (fieldName) => fieldName.split('__')[0].substring(objectPrefix.length)

//const getObjectId = (s) => s.startsWith('obj-') && s.split('__')[0].split('-')[1]

const reducer = (state, action) => {
  switch (action.type) {
  /* We comment out this base case because we also want input validation
  case 'SET_FIELD_VALUE':
    return {
      ...state,
      values:{
        ...state.values,
        ...action.payload
      }
    }
    */
  case 'SET_FIELD_VALUE':
    //console.log(777, action)
    return {
      ...state,
      values:{
        ...state.values,
        ...action.payload
      },
    }
  case 'SET_PARSED_VALUE':
    //console.log(888, action)
    return {
      ...state,
      parsed:{
        ...state.parsed,
        ...action.payload
      }
    }
  case 'SET_OBJECT_VALUE':
    return {
      ...state,
      objects:{
        ...state.objects,
        [action.payload.randomId]:{
          ...state.objects[action.payload.randomId] || {
            [action.payload.objectIdField]:state.values[
              Object.keys(state.parsed).find(e => e.startsWith(`${objectPrefix}${[action.payload.randomId]}__${action.payload.objectIdField}`))
            ]
          },
          ...action.payload.values

        }
      }
    }
  case 'MERGE_VALUES':
    return {
      ...state,
      values:{
        ...state.values,
        ...action.payload
      }
    }
  case 'MERGE_PARSED':
    return {
      ...state,
      parsed:{
        ...state.parsed,
        ...action.payload
      }
    }
  case 'SET_FIELD_TOUCHED':
    return {
      ...state,
      touched:{
        ...state.touched,
        ...action.payload
      }
    }
  case 'SET_ERRORS':
    return {
      ...state,
      errors:action.payload
    }
  case 'DESTROY_FIELD':
    return{
      ...state,
      touched:Object.keys(state.touched).reduce((a, e) =>
      {
        if (e !== action.payload ) {
          a[e] = state.touched[e]
        }
        return a
      },
      {}),
      values:Object.keys(state.values).reduce((a, e) =>
      {
        if (e !== action.payload ) {
          a[e] = state.values[e]
        }
        return a
      },
      {}),
      parsed:Object.keys(state.parsed).reduce((a, e) =>
      {
        if (e !== action.payload ) {
          a[e] = state.parsed[e]
        }
        return a
      },
      {}),
      errors:Object.keys(state.errors).reduce((a, e) =>
      {
        if (e !== action.payload ) {
          a[e] = state.errors[e]
        }
        return a
      },
      {}),
      objects:state.objects ? (action.payload.split('__').length > 1) ?  (state.objects[getRandomId(action.payload)] && (Object.keys(state.objects[getRandomId(action.payload)]).length > 1)) ? {
        // Normal Case where we remove only the field
        ...state.objects,
        [getRandomId(action.payload)]:{
          ...Object.keys(state.objects[getRandomId(action.payload)]).reduce((a,e) => {
            if (e !== action.payload.split('__')[1]) {
              a[e] = state.objects[getRandomId(action.payload)][e]
            }
            return a
          }
          ,{})
        }
      }

        : Object.keys(state.objects).reduce((a,e) => {
          if (e !== getRandomId(action.payload)) {
            a[e] = state.objects[e]
          }
          return a
        }, {})// If the field removed is the last field we remove all the object
        : state.objects  // If the field removed is not part of an object
        : undefined // If there are no objects
    }
  default:
    return state
  }
}

export default ({
  initialValues={},
  initialTouched={},
  initialErrors={},
  validation={},
  parsers={},
  debounceMs=300,
  useObjects=false,
  objectsIdField='id',
  ...otherProps
}) => {

  const parseValue = useCallback((value, name) => {
    //console.log('parsing', name, value, parsers[name])
    return parsers[name] ? parsers[name](value) : value

  },[]
  )

  const [state, dispatch=()=>null] = useReducer(reducer, {
    objects:useObjects ? {} : undefined,
    values :initialValues,
    touched:initialTouched,
    errors :initialErrors,
    parsed :Object.keys(initialValues).reduce((a, e) => {
      a[e] = parseValue(initialValues[e])
      return a
    }, {}),
  })

  const setObjectValue = useCallback((fieldName, value) => {

    if(fieldName.startsWith(objectPrefix)) {
      const randomId = fieldName.split('__')[0].substring(4)
      const fieldKey = fieldName.split('__')[1]

      dispatch({
        type   :'SET_OBJECT_VALUE',
        payload:{
          randomId,
          objectIdField:objectsIdField,
          values       :{
            [fieldKey]:value },
        }
      })
    }
  }
  ,
  []
  )

  const handleChange = useCallback(fieldName => event => {
    event.persist()

    const value = event.target.value
    dispatch({
      type   :'SET_FIELD_VALUE',
      payload:{ [fieldName]: value },
    })
    debounce(() => dispatch({
      type   :'SET_PARSED_VALUE',
      payload:{ [fieldName]: parseValue(value, fieldName) },
    }), debounceMs)()

    if(useObjects) {

      setObjectValue(
        fieldName,
        parseValue(value, fieldName.split('__')[1]),
      )
    }

  }, [debounceMs])


  const handleToggle = fieldName => event => {
    event.persist()
    const valueSet = state.values[fieldName]
    const valueToToggle = event.target.value
    valueSet &&
      (valueSet.has(valueToToggle) ?
        valueSet.delete(valueToToggle) : valueSet.add(valueToToggle)
      )
    //console.warn(97777, valueSet, valueToToggle)
    const newValue = valueSet || new Set([valueToToggle])

    dispatch({
      type   :'SET_FIELD_VALUE',
      payload:{ [fieldName]: newValue },
    })
    debounce(() => dispatch({
      type   :'SET_PARSED_VALUE',
      payload:{ [fieldName]: parseValue(newValue, fieldName) },
    }), debounceMs)()

    if(useObjects) {
      debounce(() => setObjectValue(
        fieldName,
        parseValue(newValue, fieldName.split('__')[1]),
      ), debounceMs)()
    }
  }


  const handleToggleSingle = fieldName => event => {
    const value = !state.values[fieldName] //we toggle the previous value

    dispatch({
      type   :'SET_FIELD_VALUE',
      payload:{ [fieldName]: value },
    })
    debounce(() => dispatch({
      type   :'SET_PARSED_VALUE',
      payload:{ [fieldName]: parseValue(value, fieldName) }
    }), debounceMs)()

    if(useObjects) {
      debounce(() => setObjectValue(
        fieldName,
        parseValue(value, fieldName.split('__')[1]),
      ), debounceMs)()
    }
  }


  const handleBlur = useCallback(fieldName => event => {
    dispatch({
      type   :'SET_FIELD_TOUCHED',
      payload:{ [fieldName]: true },
    })
  }, [])
  const handleFocus = handleBlur //atm they're the same but lets leave the api evolve

  const setInputTouched = handleFocus

  const setInputValue = useCallback(fieldName => value => {
    //console.log('SIV', fieldName, value)
    dispatch({
      type   :'SET_FIELD_VALUE',
      payload:{ [fieldName]: value },
    })
    dispatch({
      type   :'SET_PARSED_VALUE',
      payload:{ [fieldName]: parseValue(value, fieldName) }
    })
    if(useObjects) {
      debounce(() => setObjectValue(
        fieldName,
        parseValue(value, fieldName.split('__')[1]),
      ), debounceMs)()
    }
  },
  [parseValue]
  )

  const destroyField = useCallback(fieldName => () => {
    dispatch({
      type   :'DESTROY_FIELD',
      payload:fieldName
    })
  })

  const mergeValues = dictToMerge => {
    dispatch({
      type   :'MERGE_VALUES',
      payload:dictToMerge,
    })
    const parsedDictToMerge = Object.keys(dictToMerge).reduce((a, e) => {
      a[e] = parseValue(dictToMerge[e])
      return a
    }, {})
    dispatch({
      type   :'MERGE_PARSED',
      payload:parsedDictToMerge,
    })
  }

  const getFieldProps = fieldName => ({
    //Base Api
    value   :state.values[fieldName],
    touched :state.touched[fieldName],
    errors  :state.touched[fieldName] && state.errors[fieldName],
    onChange:handleChange(fieldName),
    onBlur  :handleBlur(fieldName),
    onFocus :handleFocus(fieldName),

    //Extra Helpers
    onToggle      :handleToggle(fieldName), //for multiple value, replaces onChange
    onToggleSingle:handleToggleSingle(fieldName), //for multiple value, replaces onChange

    //Extra Api Control
    setInputTouched:setInputTouched(fieldName),
    setInputValue  :setInputValue(fieldName),
    destroyInput   :destroyField(fieldName)
  })

  /*
   *

  {
    _all:(fields) => (fields.password !== fields.password2 )&& 'Passwords dont match'
    password:(value) =>  (value.length < 6) && 'Password is too short'
  }
   *
   */
  const setErrors = useCallback(debounce(() => {    
    var errors = {}

    Object.keys(validation).forEach(key => {
      if (key !== '_all') {
        console.log(`Validating ${key}, ${state.values[key]}`)
        const value = state.values[key]
        const validate = validation[key]

        const localErrors = validate(value)

        if (localErrors) {
          errors[key] = localErrors
        }
      }
      else {
        const validate = validation[key]
        const localErrors = validate(state.values)
        if (localErrors) {
          errors[key] = localErrors
        }
      }
    })

    //console.log('Errors will be dispatched', errors)

    dispatch({
      type   :'SET_ERRORS',
      payload:errors
    })


  }, debounceMs), [state.values])

  useEffect(() => {
    setErrors()
  }
  ,
  [state.values]
  )

  const isValid = Object.keys(state.errors).length === 0

  const getTouchedValues = () =>
    Object.keys(state.parsed).reduce((a, key) => {
      if (state.touched[key]) {
        a[key] = state.parsed[key]
      }
      return a
    }, {})

  const getObjectsArray = () =>
    Object.keys(state.objects).map(key => state.objects[key])


  return {
    setInputValue,
    mergeValues,
    values :state.values,
    parsed :state.parsed,
    touched:state.touched,
    objects:state.objects,
    errors :state.errors,
    getFieldProps,
    getTouchedValues,
    isValid,

    handleChange,
    handleBlur,
    handleToggle,

    getObjectsArray,

    dispatch, //provides deeper API control
  }
}

//https://usehooks.com/useWindowSize/
