import * as React from 'react'
import { useMemo, useState, useEffect } from 'react'

export default (value, {
  mode='letters',
  limit=undefined,
}) => {

  if (!limit) return {}

  const { current, error } = useMemo(() => {
    const l = (value && value.length) ? (mode === 'words') ? value.trim().replace(/  +/g, ' ').split(' ').length : value.length : 0
    const e = l > limit
    return {
      current:l,
      error  :e
    }
  }, [value])

  return {
    error,
    current,
  }
}
