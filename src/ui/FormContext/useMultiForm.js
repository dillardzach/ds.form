import * as React from 'react'
import { useReducer, useState, useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import FormContext from './FormContext'

import useForm from './useForm.js'

const generateRandomString = () => Math.random().toString(36).substring(5)

const objectPrefix = `obj-`
const getObjectPrefix = (i) => `${objectPrefix}${i}__`

const reducer = (state, action) => {
  switch (action.type) {

  case 'ADD_EXTRA_FORM':
    //console.log(777, action)
    return {
      ...state,
      extra:[
        ...state.extra,
        {
          _formId:generateRandomString(),
          order  :-1
        }
      ]
    }

  case 'REMOVE_LAST_EXTRA_FORM':
    //console.log(777, action)
    return {
      ...state,
      extra:[...state.extra.slice(0, state.extra.length -1)]
    }

  case 'REMOVE_FORM':
    //console.log(777, action)
    return {
      ...state,
      extra   :[...state.extra.filter(e => e._formId !== action.payload)],
      existing:[...state.existing.filter(e => e._formId !== action.payload)]
    }

  case 'SET_EXISTING':
    return {
      ...state,
      existing:action.payload,
    }

  case 'SET_ORDER':
    return {
      ...state,
      existing:state.existing.map(e => {
        if (e._formId === action.payload.randomId) {
          return {
            ...e,
            order:action.payload.order
          }
        }
        return e
      }),
      extra:state.extra.map(e => {
        if (e._formId === action.payload.randomId) {
          return {
            ...e,
            order:action.payload.order
          }
        }
        return e
      })
    }

  case 'SET_FIELD_VALUE':
    //console.log(777, action)
    return {
      ...state,
      values:{
        ...state.values,
        ...action.payload
      },
    }

  default:
    return state
  }
}

const useMultiForm = (props) => {

  const {
    Context=FormContext,
    orderField='order',
    idField='id',
    existing,
    inputMap,
    extra=2,
    confirmRemove=true
  } = props

  const {
    parsed,
    mergeValues,
    setInputValue,
    ...other
  } = useForm(Context)

  const [state, dispatch=()=>null] = useReducer(reducer, {
    extra:[...Array(extra)].map((e,i) => ({
      _formId:generateRandomString(),
      order  :-1
    })

    ),
    existing:existing ? existing.map((e, i) => ({
      _formId :generateRandomString(),
      objectId:e[idField],
      order   :e[orderField] || -2,
      object  :e
    })) : []
  })

  const { formsInfo, formsIds }  = useMemo(() => {
    const objectList = [
      ...state.existing,
      ...state.extra,
    ]
    return ({
      formsInfo:orderField ? objectList.sort(sortItems) : objectList,
      formsIds :objectList.map(e => e._formId)
    })
  }, [state, orderField])


  const sortItems = useCallback(orderField ? (a, b) => {
    if ((a[orderField] < 0) ^ (b[orderField] < 0)) {
      //console.log(a.order, b.order, 'xor')
      return (a[orderField] > 0) ? -1 : 1
    }
    return a[orderField] - b[orderField]
  } : () => null, [orderField])

  const setExistingObjects = useCallback(formsInfo => {
    dispatch({
      type   :'SET_EXISTING',
      payload:formsInfo,

    })
  }, [formsInfo])

  const addExtraForm = useCallback(order => {
    dispatch({
      type   :'ADD_EXTRA_FORM',
      payload:{ [orderField]: order },
      //payload:{ [fieldName]: event.target.value },
    })
  }, [orderField])

  const removeLastExtraForm = useCallback(() => {
    if(confirmRemove ? window.confirm('Remove the last form ?') : true) {
      dispatch({
        type:'REMOVE_LAST_EXTRA_FORM',
      })

    }
  }, [])

  const removeForm = useCallback(randomId => () => {
    if(confirmRemove ? window.confirm(`Confirm remove of form ${randomId} ?`) : true) {
      dispatch({
        type   :'REMOVE_FORM',
        payload:randomId,
      })

    }
  }, [])

  const setFormOrder = useCallback(randomId => newOrder => {
    dispatch({
      type   :'SET_ORDER',
      payload:{
        randomId,
        order:newOrder
      },
    })
  }
  ,[])

  const setOrder = useCallback((randomId, userNewOrder, oldOrder, first=true) => {
    const newOrder = Number(userNewOrder)
    const oldItemInNewPosition = formsInfo.find(e => e[orderField] === newOrder)

    //console.warn(`New order of ${randomId} from ${oldOrder} to ${newOrder} ${JSON.stringify(oldItemInNewPosition)}`, formsInfo)

    if((newOrder < oldOrder) || !oldOrder) {
      if (oldItemInNewPosition) {
        setOrder(oldItemInNewPosition._formId, newOrder - ((first || -1) * - 1), newOrder, false)
      }
      //increaseOrderRecursive()
    } else {
      if (oldItemInNewPosition) {
        setOrder(oldItemInNewPosition._formId, newOrder + ((first || -1) * - 1), newOrder, false)
      }
    }
    setFormOrder(randomId)(newOrder)//TODO Remove
    const fieldName = `${getObjectPrefix(randomId)}${orderField}`
    setInputValue(fieldName)(newOrder)
  }, [formsInfo.length, orderField])

  const changeFormOrder = useCallback(randomId => ( userNewOrder ) => {
    const oldOrder = formsInfo.find(e => e._formId === randomId).order
    setOrder(randomId, userNewOrder, oldOrder)
    return null
  })

  useEffect(() => {
    if(existing && (existing.length > 0)) {
      const existingObjects = existing.map((e, i) => {
        return {
          _formId :generateRandomString(),
          objectId:e[idField],
          object  :e,
          order   :e[orderField] || -2
        }
      })

      setExistingObjects(existingObjects)
      existing.forEach((ob) => {
        //console.log(7788, ob, ob.id, getExisting(ob[idField]), state.existing)
        const formId = existingObjects.find(e => e.objectId === ob[idField])._formId

        const prefixedValues = Object.keys(ob).reduce((a,e) => {
          a[`${getObjectPrefix(formId)}${e}`] = ob[e]
          return a
        }, {})
        mergeValues(prefixedValues)
        //console.log('Just merged ', prefixedValues, existingObjects, formId, existingObjects.find(e => e.objectId === ob[idField]))
      })

    }

  }, [existing])

  const getInputMap = useCallback(randomId =>
    inputMap.map(({name, ...inputProps}) => ({
      name:`${getObjectPrefix(randomId)}${name}`,
      ...inputProps
    })
    )
  , [inputMap])

  const getFormMethods = useCallback(randomId => ({
    reorderTo  :changeFormOrder(randomId),
    remove     :removeForm(randomId),
    getInputMap:() => getInputMap(randomId),
  }),[])


  const forms = useMemo(() =>
    formsInfo.reduce((a, o) => {
      const { getInputMap, ...methods } = getFormMethods(o._formId)
      a.push({
        inputs :getInputMap(),
        _formId:o._formId,
        methods
      })
      return a
    }, [])
  , [formsIds])

  const {
    objectsArray,
    objectsDict,
  } = useMemo(() => {
    const objectsDict = {}
    parsed && Object.keys(parsed).forEach(key => {
      if(key.startsWith(objectPrefix)) {
        const randomId = key.split('__')[0].substring(objectPrefix.length)
        const fieldKey = key.split('__')[1]
        objectsDict[randomId] = objectsDict[randomId] ?
          {
            ...objectsDict[randomId],
            [fieldKey]:parsed[key]
          }
          : { [fieldKey]: parsed[key] }  }
    })
    const objectsArray = Object.keys(objectsDict).reduce((a, key) => {
      a.push(objectsDict[key])
      return a
    }, [])

    console.log(676767, objectsDict, objectsArray, parsed)

    return {
      objectsDict,
      objectsArray
    }

  }, [parsed])

  console.log(686868, parsed)

  return {
    formsInfo,
    formsIds,
    forms,
    addExtraForm,
    removeLastExtraForm,

    objectsArray,
    objectsDict,
    /*
    removeForm,
    setFormOrder,
    setExistingObjects,
    */
  }
}

useMultiForm.propTypes = {
  /**
   * A react context object to instantiate the provider
   */
  context:PropTypes.object,
}

export default useMultiForm
