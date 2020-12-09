/* @fwrlines/generator-react-component 2.4.1 */
import * as React from 'react'
import { useMemo } from 'react'
import PropTypes from 'prop-types'


import DownshiftCombobox from './DownshiftCombobox.js'
import DownshiftMultipleCombobox from './DownshiftMultipleCombobox.js'

import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client'

//Intl

/* import { FormattedMessage} from "react-intl";
   import messages from "./messages";
    <FormattedMessage {...messages.title} /> */

import {FormattedMessage} from 'react-intl'
import messages from './messages'

//Config

import C from 'ui/cssClasses'

/* Relative imports
   import styles from './query_downshift_combobox.scss' */
import { isBackend } from 'ui/isBackend'

if(!isBackend) {
  import('./downshift_combobox.scss')
}

const baseClassName = 'query'


/**
 * Use `QueryDownshiftCombobox` to
 * Has color `x`
 */
const QueryDownshiftCombobox = ({
  id,
  className,
  style,

  query,
  multiple,

  allowReload,

  ...otherProps
}) => {

  const {
    loading,
    error,
    data={},
    refetch
  } = useQuery(gql(query),
    {
      skip                       :!query,
      notifyOnNetworkStatusChange:true
    })

  const finalData = useMemo(() => (data && data[Object.keys(data).reduce((a, e) => {
    return e
  }, '')]) || [],
  [data, loading])

  const Component = useMemo(() => multiple ?
    DownshiftMultipleCombobox : DownshiftCombobox,
  [multiple]
  )


  return (
    <Component
      className={
        [
          //styles[baseClassName],
          baseClassName,
          className
        ].filter(e => e).join(' ')
      }
      loading={ loading }
      id={ id }
      style={ style }
      options={ finalData }
      suffix={
        allowReload &&
        <a
          onClick={() => refetch()}
          className={ C.pointer }
        >
          <FormattedMessage {...messages.reload}/>
          .
        </a>

      }
      { ...otherProps }
    />
  )}

QueryDownshiftCombobox.propTypes = {
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
   * The `gql`-parsable query
   */
  query:PropTypes.string.isRequired,


  /**
   * Whether to allow multiple items selection
   */
  multiple:PropTypes.bool,

  /**
   * Whether to allow reload of the query
   */
  allowReload:PropTypes.bool

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

QueryDownshiftCombobox.defaultProps = {
  multiple:false,
  allowReload:true
}

export default QueryDownshiftCombobox
