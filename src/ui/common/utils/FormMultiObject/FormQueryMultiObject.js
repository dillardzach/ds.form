/* @fwrlines/generator-react-component 2.4.1 */
import * as React from 'react'
import { useMemo } from 'react'
import PropTypes from 'prop-types'

import FormMultiObject from './FormMultiObject.js'


import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client'
//Intl

/* import { FormattedMessage} from "react-intl";
   import messages from "./messages";
    <FormattedMessage {...messages.title} /> */

//Config

//import C from 'ui/cssClasses'

/* Relative imports
   import styles from './form_query_multi_object.scss' */


//const baseClassName = 'form_query_multi_object'


/**
 * Use `FormQueryMultiObject` to
 * Has color `x`
 */
const FormQueryMultiObject = ({
  id,
  className,

  query,

  ...otherProps
}) => {

  const {
    loading,
    error,
    data={},
    refetch
  } = useQuery(gql(query || 'query { hello }'), //hackish but necessary because on multi form reload it gets stuck
    {
      skip                       :!query,
      notifyOnNetworkStatusChange:true
    })

  const finalData = useMemo(() => (data && data[Object.keys(data).reduce((a, e) => {
    return e
  }, '')]) || [],
  [data, loading])

  return (

    <>
      <FormMultiObject
        className={
          [
            /* styles[baseClassName],
           baseClassName, */
            className
          ].filter(e => e).join(' ')
        }
        id={ id }
        existing={ finalData }
        { ...otherProps }
      />
    </>
  )}

FormQueryMultiObject.propTypes = {
  /**
   * Provide an HTML id to this element
   */
  id:PropTypes.string,

  /**
   * The html class names to be provided to this element
   */
  className:PropTypes.string,

  /**
   * The `gql`-parsable query
   */
  query:PropTypes.string.isRequired,

  /*
  : PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  : PropTypes.func,
  : PropTypes.func,
  : PropTypes.oneOf(['', ''])
  */
}

/*
FormQueryMultiObject.defaultProps = {
  status: 'neutral',
  //height:'2.2em',
  //as:'p',
}
*/
export default FormQueryMultiObject
