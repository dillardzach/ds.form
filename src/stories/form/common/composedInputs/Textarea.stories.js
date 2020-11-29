/* @fwrlines/generator-storybook-story 1.5.0 */
import * as React from 'react'
import { useState } from 'react'

//import { action } from '@storybook/addon-actions'

import { Textarea } from 'ui'
/* import QUERY from './graphql/query.graphql'
   import { AplProvider } from 'stories/utils'
   import { Router } from 'stories/utils'
   import {ALL_COLORS, SIZES } from '../config.js'
   import { LIST, LIST_XS, TEXT_XXS_ESC, TEXT_XXS, TEXT_XS, TEXT } from '../utils/Dummy' */

//const endpoint = 'https://api.fwrlines.com/graphql'

export default {
  title        :'form/common/composedInputs/Textarea',
  component    :Textarea,
  //componentSubtitle:'Component subtitle',
  subcomponents:{
    //Textarea.Item
  },
  decorators:[
    /* storyfn => <div className="">{ storyfn() }</div>,
       storyfn => <AplProvider endpoint={ endpoint }>{ storyfn() }</AplProvider>,
       storyfn => <Router>{ storyfn() }</Router>, */
  ]
}

export const Default = () => (
  <Textarea
    type='textarea'
    name={ 'openquestion' }
    label='Your story'
    inputId='story'
  />
)

export const Variant = () => (
  <Textarea
    placeholder='A nice placeholder here'
    type='textarea'
    name={ 'openquestion' }
    label='Your story'
    inputId='story'
  />
)


export const Mars = () => (
  <Textarea
    type='textarea'
    name={ 'openquestion' }
    label='Your story'
    inputId='story'
    aesthetic='mars'
  />
)

export const LimitCount = () => {
  const [value, setValue] = useState()
  const onChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <Textarea
      aesthetic='mars'
      name={ 'gasoline' }
      value={ value }
      onChange={ onChange }
      label='Tweet something?'
      inputId='tweet'
      description='Maximum 30 letters.'
      limitCount={30}
    />

  )
}

export const LimitType = () => {
  const [value, setValue] = useState()
  const onChange = (e) => {
    setValue(e.target.value)
  }
  return (
    <Textarea
      aesthetic='mars'
      name={ 'yourname' }
      value={ value }
      onChange={ onChange }
      label='Your name max 2 words ?'
      placeholder={ 'John' }
      inputId='yourname'
      limitType='words'
      limitCount={2}
    />

  )
}
