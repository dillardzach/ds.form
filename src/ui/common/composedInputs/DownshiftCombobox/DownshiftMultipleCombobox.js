/* @fwrlines/generator-react-component 2.5.1 */
import * as React from 'react'
import { memo, useEffect, useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { BaseHTMLInput } from '../../baseInputs'

import { useCombobox, useMultipleSelection } from 'downshift'

import { comparisonFunction } from 'ui/utils'

import { Popup, Label, InlineLoader, Button } from 'ds-core'

import {
  InputInside,
  InputHolder as Holder,
} from '../../elements'

//Intl

import { FormattedMessage} from 'react-intl'
import messages from './messages'

//Config

//import C from 'ui/cssClasses'

/* Relative imports
   import styles from './downshift_multiple_combobox.scss' */
import { isBackend } from 'ui/isBackend'

if(!isBackend) {
  import('./downshift_combobox.scss') //Shared SCSS
}

const baseClassName = 'downshift_multiple_combobox'
const selectedItemClassName = 'selected'
// TODO merge styles with other combobox


/**
 * Use `DownshiftMultipleCombobox` to
 * Has color `x`
 */
const DownshiftMultipleCombobox = ({
  id,
  className,
  style,

  errors,
  valid,

  disabled,
  optional,

  as:Wrapper,
  aesthetic,
  compact,

  inputId:userInputId,
  inputClassName,
  inputStyle,
  inputDisabled,

  label,
  labelAs, //This is the only new prop compared to Input
  labelId,
  labelClassName,
  labelStyle,

  description,
  descriptionAs,
  descriptionClassName,
  descriptionStyle,

  //options:allItems, //originally called items in downshift
  options:allItems, //originally called items in downshift
  itemToString:userItemToString,
  onSelectedItemsChange:userOnSelectedItemsChange,

  circularNavigation,
  menuId,
  toggleButtonId,
  getItemId,

  itemClassName,
  itemStyle,

  popupPreferredOrder,
  popupId,
  popupClassName,
  popupStyle,

  highlightedClassName,
  displayItem:userDisplayItem,
  displaySelectedItem:userDisplaySelectedItem,
  filterItems:userFilterItems,

  selectedItemDefaultClassName,

  placeholder,
  loading,

  debug,

  setInputValue,
  setInputTouched,
  touched,
  value,

  suffix,
  suffixError
}) => {

  console.log('OPTIONS ARE', allItems)

  const [textInputValue, setTextInputValue] = useState('')

  const areItemsObjects = useMemo(() =>
    allItems.length ?
      (typeof allItems[0] === 'object') ? true : false
      : false,
  [allItems]
  )

  const itemToString = useCallback(userItemToString ?
    userItemToString : (areItemsObjects ?
      (item => (item ? item.id : '')) :
      (item => (item ? String(item) : ''))
    ),
  [userItemToString, areItemsObjects]
  )

  const displayItem = useCallback(userDisplayItem ?
    userDisplayItem : (areItemsObjects ?
      (item => <span>{(item ? item._string || item.label : '')}</span>) :
      (item => <span>{(item ? String(item) : '')}</span>)
    ),
  [userDisplayItem, areItemsObjects]
  )

  const filterItems = useCallback(userFilterItems ?
    userFilterItems : (areItemsObjects ?
      ((items, searchValue) => {
        return items.filter(e => !(value.includes(itemToString(e))) && (e._string || e.label).match(new RegExp(searchValue, 'gi')))
      }) :
      ((items, searchValue) => {
        const fi = items.filter((e, i) => !(value.includes(itemToString(e))) && e.match(new RegExp(searchValue, 'gi'))
        )
        return fi
      })
      /* (item => (item ? item.label : '')) :
         (item => (item ? String(item) : '')) */
    ),
  [userFilterItems, areItemsObjects, value]
  )

  const [filteredItems, setFilteredItems] = useState(allItems)

  const onInputValueChange = ({inputValue:localValue}) =>{
    setFilteredItems(filterItems(allItems, localValue))
  }

  const onSelectedItemsChange = useCallback((setInputValue || userOnSelectedItemsChange) ?
    userOnSelectedItemsChange ? userOnSelectedItemsChange : (changes) => {
      //console.log('DS change', c)
      !touched && setInputTouched?.()
      setInputValue(
        changes.selectedItems.length ?
          changes.selectedItems.map(e => itemToString(e)) :
          null
      )
    } : () => null)


  const initialSelectedItems = useMemo(() => {
    if (value) {
      const foundItems = allItems.filter((e) => value.includes(itemToString(e)))
      return foundItems.length ? foundItems : []
    }
    else return []

  }, [allItems, value])


  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection({
    onSelectedItemsChange,
    initialSelectedItems
  })

  const displaySelectedItem = useMemo(() => {
    if(userDisplaySelectedItem) return userDisplaySelectedItem
    else {
      const Wrapper = Button

      /* eslint-disable react/prop-types */
      const Element = ({
        item:selectedItem,
        className=selectedItemDefaultClassName,
        index,
        children
      }) => (
        <Wrapper
          key={`selected-item-${index}`}
          className={[
          //styles[baseClassName],
            selectedItemClassName,
            className,
            's-1',
          ].filter(e => e).join(' ')
          }
          compact
          {...getSelectedItemProps({selectedItem, index})}
          onClick={() => removeSelectedItem(selectedItem)}
          icon='p'
          iconSide='r'
        >
          { children }
        </Wrapper>
      )


      if (areItemsObjects) return (
        (item, index) =>
          <Element
            item={ item }
            index={ index }
            className={ item.className || item.class }
          >
            {(item ? item._string || item.label : '')}
          </Element>
      )


      else return (
        (item, index) =>
          <Element
            item={ item }
            index={ index }
          >
            {(item ? String(item) : '')}
          </Element>
      )
      /* eslint-enable react/prop-types */

    }},
  [userDisplaySelectedItem, areItemsObjects]
  )


  const allUseComboboxProps = {
    items        :filteredItems,
    itemToString,
    onStateChange:({inputValue, type, selectedItem}) => {
      switch (type) {
      case useCombobox.stateChangeTypes.InputChange:
        setTextInputValue(inputValue)
        break
      case useCombobox.stateChangeTypes.InputKeyDownEnter:
      case useCombobox.stateChangeTypes.ItemClick:
      case useCombobox.stateChangeTypes.InputBlur:
        if (selectedItem) {
          setTextInputValue('')
          addSelectedItem(selectedItem)
          selectItem(null)
        }

        break
      default:
        break
      }
    },
    onInputValueChange,
    circularNavigation,
    id:userInputId,
    labelId, //This one prop comes from outside !
    menuId,
    toggleButtonId,
    getItemId,
    /*
    onSelectedItemChange,
    stateReducer,
    initialSelectedItem:selectedItem,
    initialHighlightedIndex,
    // initialInputValue,
    defaultSelectedItem,//TODO need to control this
    defaultIsOpen,
    onHighlightedIndexChange,
    onIsOpenChange,
    onStateChange,

    /* inputValue:value,
       selectedItem, */
  }

  const finalUseComboboxProps = useMemo(
    () => Object.keys(allUseComboboxProps).reduce(
      (a,e) => {
        const current = allUseComboboxProps[e]
        if (current) a[e] = current
        return a
      },
      {}
    ),
    [filteredItems.length, allItems.length]
  )

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectItem,
    inputValue:comboboxInputValue
  } = useCombobox(finalUseComboboxProps
    /* inputValue,
       items        :getFilteredItems(items), */
  )

  useEffect(() => {
    if (!filteredItems.length && allItems.length && !comboboxInputValue?.length) {
      setFilteredItems(allItems)
    }
  }, [allItems.length])

  const {
    id:inputId,
    ...otherSearchInputProps
  } = getInputProps(getDropdownProps({preventKeyAction: isOpen}))

  const holderProps = {
    id,
    //className, // We transform the classname as usual so not needed here
    style,

    errors,
    valid,

    disabled,
    optional,

    as:Wrapper,
    aesthetic,
    compact,

    inputId,

    label,
    labelAs, //This is the only new prop compared to Input
    labelId,
    labelClassName,
    labelStyle,

    description,
    descriptionAs,
    descriptionClassName,
    descriptionStyle,

    labelAdditionalProps:getLabelProps(),
    suffix,
    suffixError,
  }

  const insideContainerProps = {
    errors,
    valid,

    //rightIcon:'j',
    rightSide:loading ? (<InlineLoader
      type='circle'
      className='x-blue'
      height='2em'
    />) :
      ( <Button
        { ...getToggleButtonProps() }
        className='x-subtitle c-x'
        simple
        icon='j'
        aria-label={'toggle menu'}
      />

      ) /*:
      (<Button
        simple
        className='x-subtitle c-x'
        icon='p'
        onClick={ resetComponent }
      />)*/
    ,
    ...getComboboxProps()
    /*
    leftSide,
    rightSide,
    sidesClassName,
    sidesStyle,

    leftIcon,
    rightIcon,
    iconsClassName,
    iconsStyle,

    errorIcon,
    validIcon,
    */

  }

  const searchInputProps = {
    type       :'text',
    placeholder:placeholder,
    name       :name ,
    className  :[
      //styles[baseClassName],
      inputClassName
    ].filter(e => e).join(' '),
    //id      :userInputId,
    style   :inputStyle,
    disabled:inputDisabled,

    id:inputId,
    ...otherSearchInputProps
  }


  return (
    <Holder
      className={
        [
        //styles[baseClassName],
          baseClassName,
          className
        ].filter(e => e).join(' ')
      }
      { ...holderProps }
    >
      <div className='selected-items'>
        {selectedItems.map((selectedItem, index) => displaySelectedItem(selectedItem, index))}
      </div>
      <InputInside
        { ...insideContainerProps }
      >
        {
          <BaseHTMLInput
            { ...searchInputProps }
          />
        }
        <Popup
          className={ [
            popupClassName,
            'b-y y-background',
          ].filter(e => e).join(' ')
          }
          id={ popupId }
          //style={{ width: '200px', ...popupStyle }}
          isVisible={ isOpen }
          preferredOrder={ popupPreferredOrder }
          style={ popupStyle }
        >
          <ul
            {...getMenuProps()}
            className='compact'
          >
            {
              filteredItems.length ? filteredItems.map((item, index) => (
                <li
                  className={ [
                    itemClassName,
                    (highlightedIndex === index) && highlightedClassName
                  ].filter(e => e).join(' ')
                  }
                  style={ itemStyle }
                  key={`${item}${index}`}
                  {...getItemProps({item, index})}
                >
                  {
                    displayItem(item)
                  }
                </li>
              )) :
                (
                  <li>
                    <FormattedMessage { ...messages.notFound }/>
                  </li>
                )}
          </ul>
        </Popup>
      </InputInside>

      { debug &&
        <div>
          <pre>
            filteredItems :
            {' '}
            { JSON.stringify(filteredItems, null, 2) }
            value :
            {' '}
            { JSON.stringify(value, null, 2) }
            (The value is only displayed if the component is in a FormContextProvider)
          </pre>
        </div>
      }
    </Holder>
  )}

DownshiftMultipleCombobox.propTypes = {
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
   * Whether the input is on an errors state. Will be displayed before the description.
   */
  errors:PropTypes.string,

  /**
   * Whether the input is valid. If a sentence, will be displayed before the description.
   */
  valid:PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),


  /**
   * Whether the input is disabled. This property is applied at the wrapper level, and only if the wrapper is a fieldset
   */
  disabled:PropTypes.bool,

  /**
   * Whether the input is optional. Is considered a better practice than to mark the required fields
   */
  optional:PropTypes.bool,

  /**
   * Which html tag to use
   */
  as:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),

  /**
   * The display style.
   */
  aesthetic:PropTypes.oneOf(['mars', 'saturn']),

  /**
   * Whether the input is compact
   */
  compact:PropTypes.bool,

  /**
   * Provide an HTML id to the input
   */
  inputId:PropTypes.string.isRequired,

  /**
   * The html class names to be provided to the input
   */
  inputClassName:PropTypes.string,

  /**
   * The JSX-Written, css styles to apply to the input.
   */
  inputStyle:PropTypes.object,

  /**
   * Whether the input is disabled. Do not apply at the same time as 'disabled'
   */
  inputDisabled:PropTypes.bool,

  /**
   * The content of the label
   */
  label:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),

  /**
   * Which html tag to use to display the label (This prop doesnt exist in the input component)
   */
  labelAs:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),

  /**
   * Provide an HTML id to the label. Trumps https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#labelid
   */
  labelId:PropTypes.string,

  /**
   * The html class names to be provided to the label
   */
  labelClassName:PropTypes.string,

  /**
   * The JSX-Written, css styles to apply to the label.
   */
  labelStyle:PropTypes.object,

  /**
   * The input description
   */
  description:PropTypes.string,

  /**
   * Which html tag to use
   */
  descriptionAs:PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),

  /**
   * The html class names to be provided to the input description
   */
  descriptionClassName:PropTypes.string,

  /**
   * The JSX-Written, css styles to apply to the input description.
   */
  descriptionStyle:PropTypes.object,

  /**
   * The items to display in the dropdown. https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#items. This is the renamed prop "items" from downshift, renamed here for api coherence
   */
  options:PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.string
    ),
    PropTypes.arrayOf(
      PropTypes.object
    )
  ]),


  /**
   * https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#itemtostring
   */
  itemToString:PropTypes.func,

  /**
   * https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#onselecteditemchange
   */
  onSelectedItemsChange:PropTypes.func,

  /**
   * https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#circularnavigation
   */
  circularNavigation:PropTypes.bool,

  /**
   * https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#menuid
   */
  menuId:PropTypes.string,

  /**
   * https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#togglebuttonid
   */
  toggleButtonId:PropTypes.string,

  /**
   * https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#getitemid
   */
  getItemId:PropTypes.func,

  /**
   * The html class names to be provided to the items in the menu.
   */
  itemClassName:PropTypes.string,

  /**
   * The JSX-Written, css styles to apply to the items in the menu.
   */
  itemStyle:PropTypes.object,

  /**
   * In which order should we open the pop-up. Warning : Default is different than the base Popup component
   */
  popupPreferredOrder:PropTypes.arrayOf(
    PropTypes.oneOf([
      'bottom',
      'top',
      'right',
      'left'
    ])
  ),

  /**
   * The html id for the popup.
   */
  popupId:PropTypes.string,

  /**
   * The html class names to be provided to the popup/
   */
  popupClassName:PropTypes.string,

  /**
   * The JSX-Written, css styles to apply to the popup.
   */
  popupStyle:PropTypes.object,

  /**
   * The html class names to be provided to the input description
   */
  highlightedClassName:PropTypes.string,

  /**
   * This function takes an item and outputs the component displayed as the children of each list item. Defaults to the current string for an array of strings, and for item.value for an array of objects
   */
  displayItem:PropTypes.func,

  /**
   * This function takes an item and outputs the component displayed in the button. Defaults to the current string for an array of strings, and for item.value for array of objects
   */
  displaySelectedItem:PropTypes.func,

  /**
   * whether the map returns an array
   */
  filterItems:PropTypes.array,

  /**
   * The default class to apply to the element's selected items buttons. Note that this is automatically trumped if the item has .class or .className key.
   */
  selectedItemDefaultClassName:PropTypes.string,

  /**
   * placeholder for the input
   */
  placeholder:PropTypes.string,

  /**
   * Whether the input is in the loading state.
   */
  loading:PropTypes.bool,

  /**
   * Whether the input is in debug mode (prints the available options and the value).
   */
  debug:PropTypes.bool,

  /**
   * the funnction to set the value of input
   */
  setInputValue:PropTypes.func,

  /**
   * the function to set inputTouched value.
   */
  setInputTouched:PropTypes.func,

  /**
   * whether the input is touched
   */
  touched:PropTypes.bool,

  /**
   * set value to string
   */
  value:PropTypes.string,

  /**
   * A suffix to add right of the description
   */
  suffix:PropTypes.string,

  /**
   * Whether the suffix is in error state
   */
  suffixError:PropTypes.boolean,
}

DownshiftMultipleCombobox.defaultProps = {
  debug                       :false,
  loading                     :false,
  circularNavigation          :true,
  popupPreferredOrder         :['bottom', 'top'],
  highlightedClassName        :'b-light-y',
  selectedItemDefaultClassName:'x-green'
  /* height:'2.2em',
     as:'p', */
  /* height:'2.2em',
     as:'p', */
}

//export default DownshiftMultipleCombobox
export default memo(DownshiftMultipleCombobox, comparisonFunction)
