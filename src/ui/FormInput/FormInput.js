/* @fwrlines/generator-react-component 1.4.0 */
import * as React from 'react'
import { memo } from 'react'
import PropTypes from 'prop-types'

import {
  useFormInput
} from 'ui/utils'

import {
  Checkbox,
  Input,
  Textarea,
  Choice,
  Select,
  SVGChoice,
  SVGCheckbox,
  CardChoice,
  DownshiftSelect,
  DownshiftCombobox,
  QueryDownshiftCombobox,
  DownshiftMultipleCombobox,
  Dropzone
} from '../common'

import { FormContext } from '../FormContext'

/* Config*/
import C from 'ui/cssClasses'
import formConfig from '../formConfig'

/* Relative imports
   import styles from './input.scss' */
//import('./form_input.scss')

/* const baseClassName = 'input' // Better define in holder
    */
const  eqfunction = ({prevValue}, {nextValue}) => prevValue === nextValue

const AcceptedHTMLInputTypes = [
  'text',
  'email',
  'password',
  'number',
  'date',
  'datetime',
  'month',
  'tel',
  'hidden'
]

/**
 * Use `FormInput` to
 * Has color `x`
 * All the other props than type are passed to the particular input
 * Needs to be wrapped in FormContextProvider
 */
const FormInput = ({
  cleanup,
  context,
  type,
  name,
  ...allProps
}) => {

  const inputProps = useFormInput(name, context, cleanup)

  //console.warn('IP', inputProps)

  const passedProps = {
    ...inputProps,
    ...allProps,
    name,
  }

  //console.log(passedProps.onChange)
  const displayComponent = (baseComp, props) => {
    const Comp = baseComp
    return <Comp {...props} />

  }

  if (AcceptedHTMLInputTypes.includes(type)) return(
    displayComponent(Input, {
      type,
      ...passedProps
    })
  )

  else if (type === 'textarea') return(
    displayComponent(Textarea, {
      ...passedProps
    })
  )

  else if (type === 'checkbox') return(
    displayComponent(Checkbox, {
      ...passedProps
    })
  )

  else if (type === 'svg-checkbox') return(
    displayComponent(SVGCheckbox, {
      ...passedProps
    })
  )

  else if (type === 'select') return(
    displayComponent(Select, {
      //multiple={ type === 'checkboxes' ? true : false } //Multiple not implemented because select multiple has a terrible UI
      ...passedProps
    })
  )

  else if ([ 'checkboxes', 'radios' ].includes(type)) return(
    displayComponent(Choice, {
      multiple:type === 'checkboxes' ? true : false ,
      ...passedProps
    })
  )

  else if ([ 'svg-checkboxes', 'svg-radios' ].includes(type)) return(
    displayComponent(SVGChoice, {
      multiple:type === 'svg-checkboxes' ? true : false,
      ...passedProps
    })
  )

  else if ([ 'card-checkboxes', 'card-radios' ].includes(type)) return(
    displayComponent(CardChoice, {
      multiple:type === 'card-checkboxes' ? true : false ,
      ...passedProps
    })
  )

  else if ( type == 'downshift-select' ) return(
    displayComponent(DownshiftSelect, {
      ...passedProps
    })
  )

  else if ( type == 'downshift-combobox' ) return(
    displayComponent(DownshiftCombobox, {
      ...passedProps
    })
  )

  else if ( type == 'query-downshift-combobox' ) return(
    displayComponent(QueryDownshiftCombobox, {
      ...passedProps
    })
  )

  else if ( type == 'downshift-multiple-combobox' ) return(
    displayComponent(DownshiftMultipleCombobox, {
      ...passedProps
    })
  )

  else if ( type == 'dropzone' ) return(
    displayComponent(Dropzone, {
      ...passedProps
    })
  )

  else if ( type == 'image-dropzone' ) return(
    displayComponent(Dropzone, {
      imageUploader:true,
      accept       :'image/jpeg, image/png',
      ...passedProps
    })
  )

}

FormInput.propTypes = {
  /**
   * Whether the input cleans up the form state after unmount (disable if you want to keep the form state even if the form input is not displayed anymore)
   */
  cleanup:PropTypes.bool,

  /**
   * A react context object to instantiate the provider
   */
  context:PropTypes.object,

  /**
   * The type of the input
   */
  type:PropTypes.oneOf([
    ...AcceptedHTMLInputTypes,
    'textarea',
    'checkbox',
    'checkboxes',
    'radios',
    'select',
    'card-checkboxes',
    'card-radios',
    'svg-checkboxes',
    'svg-radios',
    'downshift-combobox',
    'query-downshift-combobox',
    'downshift-select',
    'downshift-multiple-combobox',
    'dropzone',
    'image-dropzone'
  ]
  ),

  /**
   * The display style.
   */
  aesthetic:PropTypes.oneOf(['mars', 'saturn']),
}

FormInput.defaultProps = {
  cleanup  :true,
  context  :FormContext,
  aesthetic:formConfig.defaultAesthetic,
  type     :'text',
}

export default FormInput
