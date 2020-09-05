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
          _formId:generateRandomString()
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

  debug,
}) => {

  const getObjectPrefix = (i) => `obj-${i}__`

  const finalData = []

  const [state, dispatch=()=>null] = useReducer(reducer, {
    extra:[...Array(extra)].map((e,i) => ({
      _formId:generateRandomString(),
    })

    ),
    existing:existing ? existing.map((e, i) => ({
      _formId :generateRandomString(),
      objectId:e[idField],
      order   :e[orderField]
    })) : []
  })

  const {
    values,
    parsed,
    mergeValues,
  } = useForm()

  useEffect(() => {
    mergeValues({
      'hidden-field-value':33
    })
  },
  [])

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
  })

  const removeExtraForm = useCallback(randomId => {
    if(window.confirm('If you have written something in the form please note this object hasnt been saved to the database yet and this data will be lost. Continue and remove this form ?')) {
      dispatch({
        type:'REMOVE_EXTRA_FORM',
        payload:randomId,
      })

    }
  })

  useEffect(() => {
    if(existing && existing.length) {
      const existingObjects = existing.map((e, i) => {
        return {
          _formId :generateRandomString(),
          objectId:e[idField],
          order   :e[orderField]
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


  const objects = useMemo(() => [
    ...state.existing,
    ...state.extra,


  ], [state])

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
      <h1>{ state.existing.length }</h1>


      <div>
        { objects.map((e, i) => (
          <div
            className='form-container p-u'
            id={ getObjectPrefix(i) }
            key={i}
          >
            <div className='info'>

              <div>
                { e.objectId ?
                  <span>
                    <Label circle className='x-blue'>Edit</Label>
                    {' '}
                    { e.objectId }
                  </span>
                  :
                  <Label circle className='x-orange'>New</Label>
                }
                { debug &&
                <p>
                  <strong>FormId :{' '}</strong>
                  { e._formId }
                </p>
                }
              </div>
              { !e.objectId &&
                <div className='s-1 k-s'>
                  <Button.Group independent>
                    <Button className='x-pink'
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
            </div>

            <div className='object-form'>
              <FormInput
                type='select'
                name={ `${getObjectPrefix(e._formId)}${orderField}` }
                options={objects.map((e, i) => ({
                  label:i,
                  value:i,
                }))}
              />
              { inputMap.filter(e => e.name !== idField).map(({ name, ...inputProps }, j) => (
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
   * The name of the pk field
   */
  idField:PropTypes.string,

  /**
   * The name of the field that will take care of the ordering
   */
  orderField:PropTypes.string,

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
   * Whether to display debug info
   */
  debug:PropTypes.bool,
}

FormMultiObject.defaultProps = {
  extra     :3,
  orderField:'order',
  idField   :'id',
  debug     :true
  /* height:'2.2em',
     as:'p', */
}
export default FormMultiObject
