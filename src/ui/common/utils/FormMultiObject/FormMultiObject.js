/* @fwrlines/generator-react-component 2.4.1 */
import * as React from 'react'
import { useCallback, useMemo, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'

import { Button, Label } from 'ds-core'

import { FormInput } from 'ui'

import { useForm } from 'ui/FormContext'
//Intl

/* import { FormattedMessage} from "react-intl";
   import messages from "./messages";
    <FormattedMessage {...messages.title} /> */

//Config

//import C from 'ui/cssClasses'

/* Relative imports
   import styles from './form_multi_object.scss' */
import { isBackend } from 'ui/isBackend'

if(!isBackend) {
  import('./form_multi_object.scss')
}

const baseClassName = 'form_multi_object'

const generateRandomString = () => Math.random().toString(36).substring(5)

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

  case 'REMOVE_EXTRA_FORM':
    //console.log(777, action)
    return {
      ...state,
      extra:[...state.extra.filter(e => e._formId !== action.payload)]
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

/**
 * Use `FormMultiObject` to
 * Has color `x`
 */
const FormMultiObject = ({
  id,
  className,
  style,
  children,

  inputMap,
  orderField,
  idField,
  extra,
  maxExtra,

  existing,

  ObjectActions,
  ObjectInfo,

  debug,
}) => {

  const getObjectPrefix = (i) => `obj-${i}__`

  const finalData = []

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

  const sortItems = useCallback(orderField ? (a, b) => {
    if ((a.order < 0) ^ (b.order < 0)) {
      console.log(a.order, b.order, 'xor')
      return (a.order > 0) ? -1 : 1
    }
    return a.order - b.order
  } : () => null, [])

  const objects = useMemo(() => {
    const objectList = [
      ...state.existing,
      ...state.extra,
    ]
    if (orderField) {
      return objectList.sort(sortItems)
    }
    return objectList
  }, [state, orderField])


  const {
    values,
    parsed,
    mergeValues,
    setInputValue,
  } = useForm()

  const orderInputProps = inputMap.find(e => e.name === orderField)

  const setExistingObjects = useCallback(objs => {
    dispatch({
      type   :'SET_EXISTING',
      payload:objs,

    })
  })

  const addExtraForm = useCallback(() => {
    dispatch({
      type:'ADD_EXTRA_FORM',
      //payload:{ [fieldName]: event.target.value },

    })
  })

  //const getExisting = useCallback(id => state.existing.find(e => e.objectId === id), [state.existing])

  const removeLastExtraForm = useCallback(() => {
    if(window.confirm('Remove the last form ?')) {
      dispatch({
        type:'REMOVE_LAST_EXTRA_FORM',
      //payload:{ [fieldName]: event.target.value },
      })

    }
  }, [])

  const removeExtraForm = useCallback(randomId => {
    if(window.confirm('If you have written something in the form please note this object hasnt been saved to the database yet and this data will be lost. Continue and remove this form ?')) {
      dispatch({
        type   :'REMOVE_EXTRA_FORM',
        payload:randomId,
      })

    }
  }, [])

  const setFormOrder = useCallback((randomId, newOrder) => {
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
    const oldItemInNewPosition = objects.find(e => e.order === newOrder)

    console.warn(`New order of ${randomId} from ${oldOrder} to ${newOrder} ${JSON.stringify(oldItemInNewPosition)}`, objects)

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
    setFormOrder(randomId, newOrder)
    const stateKey = `${getObjectPrefix(randomId)}${orderField}`
    setInputValue(stateKey)(newOrder)
  }, [objects])

  const onChangeOrder = (e) => {
    e.persist()
    const {
      name,
      value
    } = e.target
    const randomId = name.split('__')[0].substring(4)
    setOrder(randomId, value, parsed[name])
  }

  useEffect(() => {
    if(existing && existing.length) {
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


  const actions = useMemo(() => {
    var actionMap = [];
    /*
    ((typeof window !== 'undefined') && state.extra.length) &&
      actionMap.push({
        className:'pointer x-red',
        children :'Remove',
        onClick  :removeLastExtraForm,

      });
      */

    ((state.extra.length < maxExtra) || !maxExtra) &&
      actionMap.push({
        className:'pointer x-blue',
        children :'+',
        onClick  :addExtraForm,

      })


    return actionMap
  },

  [addExtraForm, removeExtraForm, state.extra] )




  return (
    <div
      className={
        [
        //styles[baseClassName],
          baseClassName,
          className
        ].filter(e => e).join(' ')
      }
      id={ id }
      style={ style }
    >
      <pre className='s-2 k-s'>
        Number of items :
        { state.existing.length }
        (existing)
        {' + '}
        { state.extra.length }
        (extra)
        {/* JSON.stringify(state, null, 2) */}
      </pre>


      <div>
        { objects.map((e, i) => (
          <div
            className='form-container p-u'
            id={ getObjectPrefix(i) }
            key={ e._formId }
          >
            <div className='info'>

              {ObjectInfo ? 
                <ObjectInfo
                  item={ e.object }
                >
                </ObjectInfo>
                :
                <>
                  <div>
                    <span>

                      { debug &&
                        <Label
                          basic
                          className='x-red'
                        >
                          formId :
                          {' '}
                          { e._formId }
                        </Label>
                      }
                      { e.objectId ?
                        <>
                          <Label
                            circle
                            className='x-blue'
                          >
                            Edit
                          </Label>
                          <Label
                            simple
                            className='x-blue'
                          >
                            { e.objectId }
                          </Label>
                        </>
                        :
                        <Label
                          circle
                          className='x-orange'
                        >
                          New
                        </Label>
                      }
                    </span>
                  </div>
                  { !e.objectId &&
                    <div className='s-1 k-s'>
                      <Button.Group independent>
                        <Button
                          className='x-pink'
                          onClick={ () => removeExtraForm(e._formId) }
                          className='pointer'
                        >
                          Remove form
                        </Button>
                      </Button.Group>
                    </div>
                  }
                  { e.objectId && ObjectActions &&
                    <div className='s-1 k-s'>
                      <Button.Group independent>
                        <ObjectActions
                          objectId={ e.objectId }
                        />
                      </Button.Group>
                    </div>
                  }
                </>
              }
            </div>

            <div className='object-form'>
              { orderInputProps &&
                <div className='y-background b-y'>
                  <FormInput
                    compact
                    { ...orderInputProps }
                    type='select'
                    name={ `${getObjectPrefix(e._formId)}${orderField}` }
                    //key={ `${_formId}` }
                    options={[...objects, ...Array(5)].map((e, i) => ({
                      label:i,
                      value:i,
                    }))}
                    onChange={ onChangeOrder }
                  />
                </div>}
              { inputMap.filter(e => ![idField, orderField].includes(e.name)).map(({ name, ...inputProps }, j) => (
                <FormInput
                  compact
                  key={ j }
                  name={ `${getObjectPrefix(e._formId)}${name}` }
                  { ...inputProps }
                />
              )) }
            </div>
          </div>

        )) }
      </div>
      <div className='p-u'>
        <Button.Group
          independent
          style={{ justifyContent: 'flex-end' }}
        >
          { actions.map((e, i) =>
            <Button
              key={i}
              { ...e }
            />
          ) }
          { children }
        </Button.Group>

      </div>
    </div>
  )}

FormMultiObject.propTypes = {
  /**
   * Provide an HTML id to this element
   */
  id:PropTypes.string,

  /**
   * The html class names to be provided to this element
   */
  className:PropTypes.string,

  /**
   * The JSX-Written, css styles to apply to the element.
   */
  style:PropTypes.object,

  /**
   *  The children JSX
   */
  children:PropTypes.node,

  /**
   *  The children JSX
   */
  inputMap:PropTypes.arrayOf(PropTypes.object).isRequired,

  /**
   * Which html tag to use
   */
  as:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  //as: PropTypes.string,

  /**
   * The name of the field that will take care of the ordering
   */
  orderField:PropTypes.string,

  /**
   * The name of the pk field
   */
  idField:PropTypes.string,

  /**
   * How many blank forms to display
   */
  extra:PropTypes.number,

  /**
   * The maximum number of extra forms
   */
  maxExtra:PropTypes.number,

  /**
   * Existing objects to edit. This is not required but this component makes little sense witout it. Also note that the objects are expected to all have an id key.
   */
  existing:PropTypes.arrayOf(PropTypes.object),

  /**
   * Actions to be displayed on the existing objects
   */
  ObjectActions:PropTypes.node,

  /**
   * Information about the item that will be displayed in the sidebar
   */
  ObjectInfo:PropTypes.node,

  /**
   * Whether to display debug info
   */
  debug:PropTypes.bool,
}

FormMultiObject.defaultProps = {
  extra     :2,
  orderField:'order',
  idField   :'id',
  debug     :true
  /* height:'2.2em',
     as:'p', */
}
export default FormMultiObject
