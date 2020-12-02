/* @fwrlines/generator-storybook-story 1.6.1 */
import * as React from 'react'
import { useState } from 'react'

//import { action } from '@storybook/addon-actions'

import { DownshiftMultipleCombobox } from 'ui'
/* import QUERY from './graphql/query.graphql'
   import { AplProvider } from 'stories/utils'
   import { Router } from 'stories/utils'
   import {ALL_COLORS, SIZES } from 'stories/config.js'
   import { LIST, LIST_XS, TEXT_XXS_ESC, TEXT_XXS, TEXT_XS, TEXT } from 'stories/utils/Dummy' */

/* const endpoint = 'https://api.fwrlines.com/graphql'
    */
import { LIST, LIST_XS, TEXT_XXS_ESC, TEXT_XXS, TEXT_XS, TEXT } from '../../../utils/Dummy'

export default {
  title        :'form/common/composedInputs/DownshiftMultipleCombobox',
  component    :DownshiftMultipleCombobox,
  //componentSubtitle:'Component subtitle',
  subcomponents:{
    //Item:DownshiftMultipleCombobox.Item
  },
  decorators:[
    /* storyfn => <div className="">{ storyfn() }</div>,
       storyfn => <AplProvider endpoint={ endpoint }>{ storyfn() }</AplProvider>,
       storyfn => <Router>{ storyfn() }</Router>, */
  ]
}

/*

const storyParameters = {
 previewTabs: {
    'canvas': {
      hidden: true
    },
  }
}

 */

export const Default = () => {
  const [value, setValue] = useState([LIST_XS[0], LIST_XS[3]])

  return(
    <>
      <DownshiftMultipleCombobox
        inputId='fruits'
        label='Please select your favourite fruits'
        options={ LIST_XS }
        description='Here is a list of very tasty fruits you can choose your favourites from'
        aesthetic='mars'
        value={ value }
        setInputValue={ setValue }
        debug
      />
      <p>{ value  }</p>
    </>
  )
}

//Default.parameters = storyParameters

export const Variant = () => (
  <h1>LO</h1>
)

//Variant.parameters = storyParameters
