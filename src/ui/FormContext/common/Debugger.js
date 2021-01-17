/* @fwrlines/generator-react-component 1.5.0 */
import * as React from 'react'
import { useCallback, useState, useContext } from 'react'
import PropTypes from 'prop-types'

import FormContext from '../FormContext'

import {
  Heading,
  Button,
} from 'ds-core'

/* Config
   import C from 'ui/cssClasses' */

/* Relative imports
   import styles from './debugger.scss'
   import './debugger.scss' */

//const baseClassName = 'debugger'


/**
 * Use `Debugger` to
 * Has color `x`
 */
const Debugger = ({
  context,

  id,
  className,
  style,
  initialIsOpen,
  name,

  as:Wrapper
}) => {
  const {
    values,
    parsed,
    touched,
    errors,
    objects,
    getObjectsArray,
    isValid
  } = useContext(context)

  const [isOpen, setIsOpen] = useState(initialIsOpen)

  const toggleOpen = useCallback(() => setIsOpen(!isOpen),[isOpen])

  return (
    <Wrapper
      className={
        [
        //styles[baseClassName],
          's-1 k-s',
          'l-resgrid',
          //baseClassName,
          className
        ].filter(e => e).join(' ')
      }
      id={ id }
      style={{
        '--grid-columns-xs':1,
        '--grid-columns-md':2
      }}
    >
      <Button onClick={ toggleOpen }>
        { isOpen ? 'Close ' :' Open ' }
        debuggger
        {` ${name}`}
      </Button>

      { isOpen &&
        <>

          <div>
            <Heading
              headingClassName='h4'
              heading='Values'
            >
              <ul className='compact'>
                <pre>
                  { JSON.stringify(values, null, 2) }
                </pre>
              </ul>
            </Heading>
          </div>
          <div>
            <Heading
              headingClassName='h4'
              heading='Parsed'
            >
              <ul className='compact'>
                <pre>
                  { JSON.stringify(parsed, null, 2) }
                </pre>
              </ul>

            </Heading>
          </div>
          <div>
            <Heading
              headingClassName='h4'
              heading='Touched'
            >
              <ul className='compact'>
                <pre>
                  { JSON.stringify(touched, null, 2) }
                </pre>
              </ul>
            </Heading>
          </div>

          <div>
            <Heading
              headingClassName='h4'
              heading='Errors'
            >
              <ul className='compact'>
                <pre>
                  { JSON.stringify(errors, null, 2) }
                </pre>
              </ul>
            </Heading>
          </div>

          { objects &&
            <div>
              <Heading
                headingClassName='h4'
                heading='Objects'
              >
                <pre className='x-paragraph c-x'>
                  { JSON.stringify(objects, null, 2) }
                </pre>
                <pre className='x-paragraph c-x'>
                  { JSON.stringify(getObjectsArray(), null, 2) }
                </pre>
              </Heading>
            </div>
          }

          <div>
            <Heading
              headingClassName='h4'
              heading='Validation'
            >
              { isValid ?
                <p className='h5'>
                  If there were any rules passed, the
                  {' '}
                  <span className='x-success c-x'>form is valid</span>
                  .
                </p>:
                <p className='h5'>
                  The form values didn't pass sucessfully the rules :
                  {' '}
                  <span className='x-error c-x'>form is invalid</span>
                  . The errors returned from the validation functions are displayed above.
                </p>
              }
            </Heading>
          </div>
          <div>
          </div>
        </>
      }

    </Wrapper>
  )}

Debugger.propTypes = {
  /**
   * A react context object to instantiate the provider
   */
  context:PropTypes.object,

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
   * Which html tag to use
   */
  as:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  //as: PropTypes.string,

}

Debugger.defaultProps = {
  context      :FormContext,
  as           :'div',
  initialIsOpen:false
  /* height:'2.2em',
     as:'p', */
}

export default Debugger
