/* @fwrlines/generator-storybook-story 1.6.1 */
import * as React from 'react'
//import {} from 'react'

//import { action } from '@storybook/addon-actions'
import { Button } from 'ds-core'
import { Form, FormInput, useMultiForm, FormContextDebugger, useForm } from 'ui'
/* import QUERY from './graphql/query.graphql'
   import { AplProvider } from 'stories/utils'
   import { Router } from 'stories/utils'
   import {ALL_COLORS, SIZES } from 'stories/config.js'
   import { LIST, LIST_XS, TEXT_XXS_ESC, TEXT_XXS, TEXT_XS, TEXT } from 'stories/utils/Dummy' */

//const endpoint = 'https://api.fwrlines.com/graphql'

export default {
  title        :'utils/useMultiForm',
  //component    :useMultiForm,
  /*   componentSubtitle:'Component subtitle', */
  subcomponents:{
    //Item:useMultiForm.Item
  },
  decorators:[
    //storyfn =><Form>{ storyfn() }</Form>,
    /*
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

  const MultiForm = () => {

    const inputMap = [
      {
        type          :'select', //checkboxes
        name          :'opening-time',
        inputClassName:'y-indigo',
        options       :[
          {
            value:10.5,
            label:'10:30',
            id   :'h1030',
          },
          {
            value:11,
            label:'11',
            id   :'h1100',
          },
          {
            value:11.5,
            label:'11:30',
            id   :'h1130'
          }
        ]
      },
      {
        type          :'select', //checkboxes
        name          :'closing-time',
        inputClassName:'y-indigo',
        options       :[
          {
            value:10.5,
            label:'10:30',
            id   :'h1030',
          },
          {
            value:11,
            label:'11',
            id   :'h1100',
          },
          {
            value:11.5,
            label:'11:30',
            id   :'h1130'
          }
        ]
      }
    ]

    const {
      formsInfo,
      formsIds,
      addExtraForm,
      objectsArray,
      objectsDict,
      removeLastExtraForm,
      forms,
    } = useMultiForm({
    //confirmRemove:false,
      inputMap,
    //Context:
    })

    const fx = useForm()

    return(
      <div>
        <Button onClick={ addExtraForm }>Add extra form</Button>
        <Button onClick={ removeLastExtraForm }>Remove last form</Button>
        <div>
          { forms.map((form) =>
            <div key={ form._formId }>
              Form
              <strong>
                { form._formId }
              </strong>
              <div style={{
                display:'flex'
              }}
              >
                { form.inputs.map(inputProps => (
                  <FormInput
                    key={ inputProps.name }
                    { ...inputProps }
                  />
                )) }
                <Button
                  className='x-red'
                  onClick={ form.methods.remove }
                >
                  Remove this form
                </Button>
              </div>
            </div>
          ) }
        </div>
        <FormContextDebugger/>
        <pre className='s-2'>
          OD
          { JSON.stringify(objectsDict, null, 2) }
          OA
          { JSON.stringify(objectsArray, null, 2) }
          FI
          { JSON.stringify(formsInfo, null, 2) }
          FIDS
          { JSON.stringify(formsIds, null, 2) }
          F
          { JSON.stringify(forms, null, 2) }
        </pre>
      </div>
    )
  }

  return (
    <Form>
      <MultiForm>
      </MultiForm>
    </Form>
  )
}

//Variant.parameters = storyParameters
