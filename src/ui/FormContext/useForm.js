import * as React from 'react'
import Context from './FormContext'
import { useContext } from 'react'

export default (C) => useContext(C||Context)
